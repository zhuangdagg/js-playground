
export function debounce(fn: Function, t: number = 100) {
    let handle: any
    return (...args: any[]) => {
        if(handle) clearTimeout(handle)
        handle = setTimeout(() => {
            fn(...args)
        }, t)
    }
}