hostx
===========

一条命令更新hosts，你懂的。

安装：

    npm install -g hostx

在你的hosts文件新增一个分组：`#==== google`，用于hostx把更新的hosts地址写入到该分组中。

例如：

    #127.0.0.1 qunarzz.com
    #192.168.236.249 qunarzz.com
    192.168.224.122 check.qunar.com
    127.0.0.1 check.qunarman.com

    #==== 数据系统
    127.0.0.1 local.dc.qunar.com
    #==== 数据系统

    #==== google
    #更新的hosts会被写在这里
    #==== google


使用：

    hostx

如上，会把最新的hosts写入到两个 `#==== google` 之间的位置。

清除掉已经更新的 hosts：

    hostx -c

查看帮助：

    hostx -h
