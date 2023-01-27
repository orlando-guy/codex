const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json"
}

export const postData = async (url, options = {}) => {
    return await fetch(url, {
        ...options,
        headers,
        method: 'POST'
    })
}