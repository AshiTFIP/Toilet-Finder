if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
    .then(reg => {
    console.info('Service worker registered ', reg)
    })
    .catch(error => {
    console.error('Cannot register server worker ', error)
    })
    }