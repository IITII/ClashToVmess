/**
 * @author IITII <ccmejx@gmail.com>
 * @date 2022/03/12
 */
'use strict'
const config = require('./config'),
    fs = require('fs'),
    path = require('path'),
    axios = require('./libs/libAxios'),
    Base64 = require('./libs/Base64'),
    yaml = require('js-yaml')

async function loadHttpYaml(urlArr) {
    return await Promise.allSettled([...new Set(urlArr)].map(_ => axios.get(_)))
        .then(res => {
            res.filter(_ => !(_.status === 'fulfilled' && _.value.status === 200))
                .map(_ => console.log(`Failed: ${_.value.config.url} ${_.value.status} ${_.value.data}`))
            return res.filter(_ => _.status === 'fulfilled' && _.value.status === 200)
                .map(_ => _.value.data)
                .map(_ => yaml.load(_), 'utf8')
        })
}

function clashToVmess(clash) {
    if (clash.type !== 'vmess') {
        return ''
    }
    const vmess = {
        "v": "2",
        "ps": "baidu.com",
        "add": "baidu.com",
        "port": "443",
        "id": "uuid",
        "aid": "0",
        "scy": "auto",
        "net": "ws",
        "type": "none",
        "host": "baidu.com",
        "path": "/path",
        "sni": "baidu.com",
        "alpn": "http/1.1",
        "tls": "tls",
    }
    vmess.ps = clash.name
    vmess.add = clash.server
    vmess.port = clash.port
    vmess.id = clash.uuid
    vmess.aid = clash.alterId
    vmess.scy = clash.cipher
    vmess.net = clash.network
    vmess.host = clash.server
    vmess.path = clash[`${clash.network}-opts`].path
    vmess.sni = clash.server
    if (clash.network === 'h2') {
        vmess.alpn = 'h2'
    }
    return vmess
}

function write(file, data) {
    if (!fs.existsSync(file)) {
        if (!fs.existsSync(path.dirname(file))) {
            console.log(`mkdir ${path.dirname(file)}`)
            fs.mkdirSync(path.dirname(file), {recursive: true})
        }
    }
    console.log(`write to ${file}`)
    fs.writeFileSync(file, data, 'utf8')
}

loadHttpYaml(config.clash)
    .then(res => res.map(r => {
        console.log(new Date())
        const proxy = r['proxy-providers']
        const res = []
        for (const proxyElement in proxy) {
            res.push({type: proxy[proxyElement].type, url: proxy[proxyElement].url})
        }
        return res.filter(_ => _.type === 'http').map(_ => _.url)
    }).flat())
    .then(res => loadHttpYaml(res))
    .then(res => res.flatMap(_ => _.proxies))
    .then(_ => _.map(r => clashToVmess(r)))
    .then(_ => _.map(r => JSON.stringify(r)))
    .then(_ => _.map(r => Base64.encode(r)))
    .then(_ => _.map(r => `vmess://${r}`))
    .then(res => {
        console.log(`Total: ${res.length} links`)
        if (res.length === 0) {
            console.log('No link, end...')
            return
        }
        const vmess = res.join('\n') + '\n'
        const sub = Base64.encode(vmess)
        write(config.vmessOutput, vmess)
        write(config.subOutput, sub)
    })
    .catch(err => console.log(err))


