---
layout: post
title: 【转】LINUX 查看tcp连接数及状态
category: "linux"
tags: [linux, tcp]
original: http://pzzy2000.iteye.com/blog/1299660
---
	netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}' 
	TIME_WAIT 8947       等待足够的时间以确保远程TCP接收到连接中断请求的确认
	FIN_WAIT1 15           等待远程TCP连接中断请求，或先前的连接中断请求的确认
	FIN_WAIT2 1            从远程TCP等待连接中断请求
	ESTABLISHED 55      代表一个打开的连接
	SYN_RECV 21          再收到和发送一个连接请求后等待对方对连接请求的确认
	CLOSING 2                没有任何连接状态
	LAST_ACK 4           等待原来的发向远程TCP的连接中断请求的确认

TCP连接状态详解  

- LISTEN：          侦听来自远方的TCP端口的连接请求
- SYN-SENT：    再发送连接请求后等待匹配的连接请求
- SYN-RECEIVED：再收到和发送一个连接请求后等待对方对连接请求的确认
- ESTABLISHED： 代表一个打开的连接
- FIN-WAIT-1：  等待远程TCP连接中断请求，或先前的连接中断请求的确认
- FIN-WAIT-2：  从远程TCP等待连接中断请求
- CLOSE-WAIT：  等待从本地用户发来的连接中断请求
- CLOSING：     等待远程TCP对连接中断的确认
- LAST-ACK：    等待原来的发向远程TCP的连接中断请求的确认
- TIME-WAIT：   等待足够的时间以确保远程TCP接收到连接中断请求的确认
- CLOSED：      没有任何连接状态
