#!/usr/bin/env node
var argv = require('optimist').argv;
var hostx = require('../index');

if (argv.c) {
    hostx.clear();
}
else if (argv.h) {
    console.log(
        'Usage: hostx       更新hosts\n' +
        '   or: hostx -c    清除更新的hosts \n' +
        '   or: hostx -h    查看帮助 \n'
    );
}
else {
    hostx.run();
}