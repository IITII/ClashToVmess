/**
 * @author IITII <ccmejx@gmail.com>
 * @date 2022/03/12
 */
'use strict'
module.exports = {
    // clash 订阅地址
    clash: [
        // 'https://github.com/IITII/ClashToVmess',
    ],
    // vmess 链接文件地址
    vmessOutput: process.env.VMEAS_OUTPUT || './tmp/vms',
    // 订阅链接文件地址
    subOutput: process.env.BASE64_OUTPUT || './tmp/base',
}