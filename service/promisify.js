export default function promisify(func) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      func.call(null, ...args, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}
