/**
 *
 * @param {Function} callback 
 * @param {number} delay
 * @returns {Function}
 */
export const debounce = (callback, delay) => {
    let timer;
    return function () {
        const args = arguments
        const context = this
        clearTimeout(timer)
        timer = setTimeout(() => {
            callback.apply(context, args)
        }, delay)
    }
}

/**
 * 
 * @param {string} email 
 * @returns 
 */
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}