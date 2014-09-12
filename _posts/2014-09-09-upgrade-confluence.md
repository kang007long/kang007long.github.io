---
layout: post
title: 更新confluence3.5.4到5.1.4
category: "linux"
tags: [linux]
---

## 升级GLIBC2.3.4到2.4
参考：

http://blog.csdn.net/heavenying/article/details/4122887

http://www.ibm.com/developerworks/cn/linux/l-cn-glibc-upd/

-- 下载glibc

	[@wendah2 usr]# mkdir /opt/glibc
    [@wendah2 usr]# cd /opt/glibc
    [@wendah2 glibc]# wget http://ftp.gnu.org/gnu/glibc/glibc-2.4.tar.gz

-- 备份关键目录
    
    [@wendah2 opt]# cd /
    [@wendah2 /]# cp -a /lib /lib.old
    [@wendah2 /]# cp -a /lib64 /lib64.old
    [@wendah2 /]# cd /usr
    [@wendah2 usr]# cp -a lib lib.old
    [@wendah2 usr]# cp -a bin bin.old
    [@wendah2 usr]# cp -a sbin sbin.old
    [@wendah2 usr]# cp -a include include.old

-- 解压安装glibc

    [@wendah2 glibc]# tar -xzvf glibc-2.4.tar.gz
    [@wendah2 glibc]# mkdir build
    [@wendah2 glibc]# cd build
    [@wendah2 build]# ../glibc-2.4/configure --prefix=/usr
    [@wendah2 build]# make
    [@wendah2 build]# make install
    ....

安装过程会报错：

    rm: relocation error: /lib64/tls/libc.so.6: symbol _dl_out_of_memory, version GLIBC_PRIVATE not defined in file ld-linux-x86-64.so.2 with link time reference
    make[1]: *** [install-symbolic-link] Error 127
    make[1]: Leaving directory `/opt/glibc/glibc-2.4'
    make: *** [install] 错误 2

输入任何命令都会报错，进行修复：

    [@wendah2 build]# export LD_PRELOAD=/lib64/libc.so.6
    [@wendah2 build]# cd /lib64/tls
    [@wendah2 tls]# cp -f ../libthread_db-1.0.so .
    [@wendah2 tls]# cp ../libc-2.4.so .
    [@wendah2 tls]# cp ../libm-2.4.so .
    [@wendah2 tls]# cp ../libpthread-2.4.so .
    [@wendah2 tls]# cp ../librt-2.4.so .
    [@wendah2 tls]# ln -sf libc-2.4.so libc.so.6
    [@wendah2 tls]# ln -sf libm-2.4.so libm.so.6
    [@wendah2 tls]# ln -sf libpthread-2.4.so libpthread.so.0
    [@wendah2 tls]# ln -sf librt-2.4.so librt.so.1
    [@wendah2 tls]# unset LD_PRELOAD

再次安装
    
    [@wendah2 tls]# cd /opt/glibc/build/
    [@wendah2 build]# make install
    [@wendah2 build]# /lib64/libc.so.6 
    GNU C Library development release version 2.4, by Roland McGrath et al.
    Copyright (C) 2006 Free Software Foundation, Inc.
    ....

<!--break-->

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

    [@wendah2 java]# rpm -ivh jdk-7u67-linux-x64.rpm
    [@wendah2 java]# java -version
    java version "1.7.0_67"
    Java(TM) SE Runtime Environment (build 1.7.0_67-b01)
    Java HotSpot(TM) 64-Bit Server VM (build 24.65-b04, mixed mode)


## 更新confluence3.5.4到5.0.3

-- 下载atlassian-confluence-5.0.3.zip

    http://downloads.atlassian.com/software/confluence/downloads/atlassian-confluence-5.0.3.zip

-- conflu_home移出来

    [@wendah2 opt]# cd confluence-3.5.4
    [@wendah2 confluence-3.5.4]# ./bin/catalina.sh stop
    [@wendah2 confluence-3.5.4]# mv conflu_home/ ..
    
-- 修改confluence.home

    [@wendah2 confluence-3.5.4]# vi confluence/WEB-INF/classes/confluence-init.properties 

    ....
    confluence.home=/opt/conflu_home/
    ....

-- 解压atlassian-confluence-5.0.3.zip

    [@wendah2 confluence-3.5.4]# cd ..
    [@wendah2 opt]# unzip atlassian-confluence-5.0.3.zip 

-- 修改confluence-init.properties，指定confluence.home

    [@wendah2 opt]# vi atlassian-confluence-5.0.3/confluence/WEB-INF/classes/confluence-init.properties 

    ....
    confluence.home=/opt/conflu_home/
    ....

-- 备份conflu_home

    [@wendah2 opt]# cp -a conflu_home/ conflu_home_bak

-- 修改server.xml

    [@wendah2 opt]# vi atlassian-confluence-5.0.3/conf/server.xml 

    <Server port="8000" shutdown="SHUTDOWN" debug="0">
    <Service name="Tomcat-Standalone">
        <Connector className="org.apache.coyote.tomcat4.CoyoteConnector" port="8090" minProcessors="5"

    ...

    <Context path="" docBase="../confluence" debug="0" reloadable="false" useHttpOnly="true">
                    <!-- Logger is deprecated in Tomcat 5.5. Logging configuration for Confluence is specified in confluence/WEB-INF/classes/log4j.properties -->
                    <Manager pathname="" />
    ...

    改为：

    <Server port="8093" shutdown="SHUTDOWN" debug="0">
    <Service name="Tomcat-Standalone">
        <Connector className="org.apache.coyote.tomcat4.CoyoteConnector" port="8099" minProcessors="5"

    ...
    
    <Context path="" docBase="../confluence" debug="1" reloadable="false" useHttpOnly="true">

                 <Valve className="org.apache.catalina.valves.AccessLogValve" prefix="localhost_access_log." suffix=".txt" pattern="common"/>

    <Resource name="jdbc/JiraDS" auth="Container" type="javax.sql.DataSource"
                username="xxxxxx"
                password="xxxxxx"
                driverClassName="com.mysql.jdbc.Driver"
                url="jdbc:mysql://xx.xx.xx.xx/jiradb?autoReconnect=true&amp;sessionVariables=tx_isolation='read-committed'"/>
    ...

-- 修改JAVA_HOME

    [@wendah2 opt]# vi atlassian-confluence-5.0.3/bin/setenv.sh

    export JAVA_OPTS
    export JAVA_HOME=/usr/java/default
    ...

-- 替换atlassian-extras-2.4.jar

    [@wendah2 opt]# cp confluence-3.5.4/atlassian-extras-2.4.jar atlassian-confluence-5.0.3/confluence/WEB-INF/lib/atlassian-extras-2.4.jar
    cp: overwrite `atlassian-confluence-5.0.3/confluence/WEB-INF/lib/atlassian-extras-2.4.jar'? y

-- 清理数据库的垃圾数据，否则启动confluence后，自动执行更新数据库脚本时，创建外键会报错

执行以下sql

    mysql> delete from cwd_membership where child_user_id not in (select id from cwd_user);
    mysql> delete from cwd_user_attribute where user_id not in (select id from cwd_user);
    

-- 启动confluence-5.0.3

    [@wendah2 opt]# atlassian-confluence-5.0.3/bin/catalina.sh start

 等待confluence更新数据库结构和索引，登陆验证功能正常


## 更新confluence5.0.3到5.1.4

-- 停止confluence-5.0.3
    
    [@wendah2 opt]# atlassian-confluence-5.0.3/bin/catalina.sh stop

-- 下载atlassian-confluence-5.1.4.zip
    http://www.atlassian.com/software/confluence/downloads/binary/atlassian-confluence-5.1.4.zip

-- 解压atlassian-confluence-5.1.4.zip

    [@wendah2 opt]# unzip atlassian-confluence-5.1.4.zip 

-- 修改confluence-init.properties，指定confluence.home

    [@wendah2 opt]# vi atlassian-confluence-5.1.4/confluence/WEB-INF/classes/confluence-init.properties 

    ....
    confluence.home=/opt/conflu_home/
    ....

-- 修改server.xml

    [@wendah2 opt]# vi atlassian-confluence-5.1.4/conf/server.xml 

    <Server port="8000" shutdown="SHUTDOWN" debug="0">
    <Service name="Tomcat-Standalone">
        <Connector className="org.apache.coyote.tomcat4.CoyoteConnector" port="8090" minProcessors="5"

    ...

    <Context path="" docBase="../confluence" debug="0" reloadable="false" useHttpOnly="true">
                    <!-- Logger is deprecated in Tomcat 5.5. Logging configuration for Confluence is specified in confluence/WEB-INF/classes/log4j.properties -->
                    <Manager pathname="" />
    ...

    改为：

    <Server port="8093" shutdown="SHUTDOWN" debug="0">
    <Service name="Tomcat-Standalone">
        <Connector className="org.apache.coyote.tomcat4.CoyoteConnector" port="8099" minProcessors="5"

    ...
    
    <Context path="" docBase="../confluence" debug="1" reloadable="false" useHttpOnly="true">

                 <Valve className="org.apache.catalina.valves.AccessLogValve" prefix="localhost_access_log." suffix=".txt" pattern="common"/>

    <Resource name="jdbc/JiraDS" auth="Container" type="javax.sql.DataSource"
                username="xxxxxx"
                password="xxxxxx"
                driverClassName="com.mysql.jdbc.Driver"
                url="jdbc:mysql://xx.xx.xx.xx/jiradb?autoReconnect=true&amp;sessionVariables=tx_isolation='read-committed'"/>
    ...

-- 修改JAVA_HOME

    [@wendah2 opt]# vi atlassian-confluence-5.1.4/bin/setenv.sh

    export JAVA_OPTS
    export JAVA_HOME=/usr/java/default
    ...

-- 替换atlassian-extras-2.4.jar

    [@wendah2 opt]# cp confluence-3.5.4/atlassian-extras-2.4.jar atlassian-confluence-5.1.4/confluence/WEB-INF/lib/atlassian-extras-2.4.jar
    cp: overwrite `atlassian-confluence-5.1.4/confluence/WEB-INF/lib/atlassian-extras-2.4.jar'? y

-- 拷贝mysql-connector

    [@wendah2 opt]# cp confluence-3.5.4/confluence/WEB-INF/lib/mysql-connector-java-5.1.11.jar atlassian-confluence-5.1.4/confluence/WEB-INF/lib/

-- 启动confluence-5.1.4

    [@wendah2 opt]# atlassian-confluence-5.1.4/bin/catalina.sh start