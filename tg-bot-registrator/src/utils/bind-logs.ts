const defaultLog = console.log;
console.log = (...args) => {
    defaultLog(...args, new Date())
}

const defaultError = console.error;
console.error = (...args) => {
    defaultError(...args, new Date())
}
