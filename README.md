# Clash To Vmess

* 将 Clash 订阅链接转换成 Vmess 链接和 Vmess 订阅

## 安装&配置

1. `git clone https://github.com/IITII/ClashToVmess.git && cd ClashToVmess`
2. `npm install`
3. 修改 `config.json`
4. `npm run start`

```js
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
```

## Cron

```
5 */12 * * * source /root/.zshrc && cd /root/ClashToVmess && npm run start >/tmp/c2v.log 2>&1
```

## Note

* 仅支持使用 Provider 定义的 Clash 订阅链接
* 支持多个 Clash 订阅链接中的多个节点，自动向下扫描所有节点，并添加到最终结果