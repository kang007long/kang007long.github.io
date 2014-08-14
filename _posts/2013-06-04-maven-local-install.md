---
layout: post
title: 【转】maven添加jar包到本地库
category: "maven"
tags: [maven]
original: http://blog.csdn.net/enjoyinwind/article/details/7732825
---
    mvn install:install-file
    -DgroupId=包名
    -DartifactId=项目名
    -Dversion=版本号
    -Dpackaging=jar
    -Dfile=jar文件所在路径

格式为：

    mvn install:install-file -Dfile=<path-to-file> -DgroupId=<group-id> -DartifactId=<artifact-id> -Dversion=<version> -Dpackaging=<packaging>

 例如：我要添加json的jar包到我的本地库，命令如下：

    mvn install:install-file -DgroupId=net.sf.json-lib -DartifactId=json-lib -Dversion=2.3 -Dfile=D:\jar\json-2.3.jar -Dpackaging=jar