/**
 * @author IITII <ccmejx@gmail.com>
 * @date 2022/03/12
 */
'use strict'

function encode(str) {
    return Buffer.from(str, 'utf-8').toString('base64')
}

function decode(str) {
    return Buffer.from(str, 'base64').toString('utf-8')
}

module.exports = {
    encode,
    decode,
}