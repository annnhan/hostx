/**
 * Created by an.han on 15/1/20.
 */

var Promise = require('./promise');
var fs = require('fs');
var http = require('http');
var https = require('https');


var URLS = [
    'http://www.racalinux.cn/hosts.txt',
    'https://github.com/racaljk/hosts/blob/master/hosts',
    'https://raw.githubusercontent.com/zxdrive/imouto.host/master/imouto.host.txt',
    'http://freedom.txthinking.com/hosts',
    'http://laod.cn/wp-content/uploads/2014/11/imouto.host_.txt'
]

var hostsFile = process.platform == 'win32' ? 'C:\\Windows\\System32\\drivers\\etc\\hosts' : '/etc/hosts';
var n = process.platform == 'win32' ? '\r\n' : '\n';
var group = '#==== google';
var groupReg = new RegExp(group + '[\n\r\n]([\\S\\s]*?)' + group, 'g');

var hostx = {

    status: 0,

    errors: 0,

    run: function () {
        var filter = this.filter.bind(this);
        var update = this.update.bind(this);

        this.backup();

        URLS.forEach(function (url) {
            this.get(url).then(filter).then(update);
        }.bind(this));
    },

    update: function (hosts) {
        var oldHost = fs.readFileSync(hostsFile).toString();
        var newHost = groupReg.test(oldHost) ?
            oldHost.replace(groupReg, group + n + hosts + n + group) : oldHost + n + group + n + hosts + n + group;

        fs.writeFile(hostsFile, newHost, this._callback('恭喜，更新 hosts 成功！'));
    },

    filter: function (obj) {
        var host = '',
            url = obj.url,
            result = obj.result;
        switch (url) {
            case 'https://github.com/racaljk/hosts/blob/master/hosts':
                var tds = result.match(/<td id="LC\d+" class="blob-code js-file-line">\.+<\/td>/);
                tds.forEach(function (td) {
                    host += (td.replace(/<\.+?>/, '') + n);
                });
                break;
            default :
                host = result;
                break;
        }
        host = host.replace(/#.*?(\n|\r\n)/g, '');
        return host
    },

    get: function (url) {
        var self = this;
        var pm = new Promise();
        var req = /^https/.test(url) ? https : http;
        req.get(url, function (res) {
            var result = '';
            res.on('data', function (r) {
                result += r;
            });
            res.on('end', function () {
                if (self.status == 0) {
                    self.status = 1;
                    pm.resolve({
                        url: url,
                        result: result
                    });
                }
            });
        }).on('error', function (e) {
            if (++self.errors == URLS.length && self.status == 0) {
                console.error('更新失败！');
                process.exit();
            }
            pm.reject(e);
        });
        return pm;
    },

    backup: function () {
        fs.writeFileSync('./hosts.bak', fs.readFileSync(hostsFile));
    },

    clear: function () {
        fs.writeFile(hostsFile, fs.readFileSync(hostsFile).toString().replace(groupReg, group + n + group), this._callback('hosts 清除成功！'));
    },

    _callback: function (txt) {
        return function (err) {
            if (err) {
                console.error('权限不够！请修改hosts文件为可写入，或使用 sudo 身份运行此命令。');
            }
            else {
                console.log(txt);
            }
            process.exit();
        }
    }
}

module.exports = hostx;