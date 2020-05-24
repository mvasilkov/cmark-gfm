'use strict'

exports.toString = function (stream) {
    let result = ''

    return new Promise(function (resolve, reject) {
        stream.on('data', function (data) {
            result += data.toString()
        })
        stream.on('end', function () {
            resolve(result)
        })
        stream.on('error', function (err) {
            reject(err)
        })
    })
}
