class ObsWebsocket {
    constructor() {
        this.socket = null
        this.listeners = {
            errors: [],
            responses: {},
            events: {}
        }
    }

    connect(credentials, checkAuthenticationFn) {
        this.socket = new WebSocket('ws://' + credentials.addr + ':' + credentials.port)

        this.socket.addEventListener('error', (err) => {
            console.error('WebSocket error', err)
            this.listeners.errors.forEach((fn) => {
                fn(err)
            })
        })

        this.socket.addEventListener('close', () => {
            console.log('WebSocket connection close')
            this.socket = null

            setTimeout(() => {
                console.log('Try to reconnect WebSocket')
                this.connect(credentials)
            }, 2000)
        })

        this.socket.addEventListener('open', () => {
            console.log('WebSocket connection established')
        })

        this.socket.addEventListener('message', async (event) => {
            const data = JSON.parse(event.data)

            // Authenticate client
            if (0 === data.op && data.d.authentication) {
                console.log('Authentication needed')

                const secret = await sha256Hash(credentials.password + data.d.authentication.salt)
                const challenged = await sha256Hash(secret + data.d.authentication.challenge)

                this.socket.send(JSON.stringify({
                    op: 1,
                    d: {
                        rpcVersion: 1,
                        authentication: challenged
                    }
                }))
            }

            // Check authentication
            else if (2 === data.op) {
                console.log('WebSocket is identified')
                if (checkAuthenticationFn) checkAuthenticationFn()
            }

            // OBS event
            else if (5 === data.op) {
                if (this.listeners.events[data.d.eventType]) {
                    this.listeners.events[data.d.eventType].forEach((fn) => {
                        fn(data.d)
                    })
                }
            }

            // OBS request response
            else if (7 === data.op) {
                if (this.listeners.responses[data.d.requestId]) this.listeners.responses[data.d.requestId](data.d)
            }
        })
    }

    addErrorListener(fn) {
        this.listeners.errors.push(fn)
    }

    addEventListener(eventType, fn) {
        if (!this.listeners.events[eventType]) this.listeners.events[eventType] = []
        this.listeners.events[eventType].push(fn)
    }

    request(type, data, fn) {
        const payload = {
            op: 6,
            d: {
                requestType: type,
                requestId: crypto.randomUUID()
            }
        }

        if (data && !(data instanceof Function)) payload.d.requestData = data
        if (data instanceof Function) fn = data

        if (fn) this.listeners.responses[payload.d.requestId] = fn

        this.socket.send(JSON.stringify(payload))
    }
}

async function sha256Hash(text) {
    console.log(crypto)
    const utf8 = new TextEncoder().encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const base64Hash = btoa(String.fromCharCode(...hashArray))

    return base64Hash
}

export default ObsWebsocket