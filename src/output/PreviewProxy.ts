let uid = 1
export class PreviewProxy {
    iframe: HTMLIFrameElement
    handlers: Record<string, Function>
    handle_event: (e: any) => void

    constructor(iframe: HTMLIFrameElement, handlers: Record<string, Function>) {
        this.iframe = iframe
        this.handlers = handlers

        this.handle_event = (e) => this.handle_repl_message(e)
        window.addEventListener('message', this.handle_event, false)
    }

    destroy() {
        window.removeEventListener('message', this.handle_event)
    }

    handle_repl_message(evt: any) {
        if (evt.source !== this.iframe.contentWindow) return
        // todo:
        console.log(evt, '--from preview proxy')
        const { typ } = evt.data
        switch(typ) {
            case 'ready':
                this.handlers?.on_ready?.(evt.data)
        }
    }

    init(state: any) {
        this.iframe.contentWindow?.postMessage({ typ: 'init', state}, {targetOrigin: '*'})
    }
}