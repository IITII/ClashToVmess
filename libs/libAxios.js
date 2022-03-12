/**
 * @author IITII <ccmejx@gmail.com>
 * @date 2022/03/12
 */
'use strict'
const libAxios = require('axios')

const axiosConfig = {
    timeout: 10000,
    timeoutErrorMessage: '连接超时, 请检查设置'
}

// init libAxios
libAxios.defaults.timeout = axiosConfig.timeout
libAxios.defaults.timeoutErrorMessage = axiosConfig.timeoutErrorMessage

module.exports = libAxios.create(axiosConfig)