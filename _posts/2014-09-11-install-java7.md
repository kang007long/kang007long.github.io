---
layout: post
title: 更新jdk6到jdk7
category: "linux"
tags: [linux]
sid: 1121
---

## 更新jdk6到jdk7

-- 到http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html下载jdk7
-- 上传到服务器

    [@wendah2 ~]# cd /usr/java
    [@wendah2 java]# rz

-- 拆卸jdk6

    [@wendah2 java]# rpm -qa | grep jdk
    jdk-1.6.0_13-fcs
    [@wendah2 java]# rpm -e --nodeps jdk-1.6.0_13-fcs

-- 安装jdk7
<!--break-->
    [@wendah2 java]# rpm -ivh jdk-7u67-linux-x64.rpm
    [@wendah2 java]# java -version
    java version "1.7.0_67"
    Java(TM) SE Runtime Environment (build 1.7.0_67-b01)
    Java HotSpot(TM) 64-Bit Server VM (build 24.65-b04, mixed mode)

## 安装jdk8
-- 下载
    $ wget --no-cookies --no-check-certificate --header "Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u171-b11/512cd62ec5174c3487ac17c61aaa89e8/jdk-8u171-linux-x64.rpm
