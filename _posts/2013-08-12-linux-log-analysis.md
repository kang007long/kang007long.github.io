---
layout: post
title: 【转】应知应会：在linux/unix上分析程序日志的技巧 
category: "linux"
tags: [linux,日志]
original: http://blog.csdn.net/jinxfei/article/details/4562559
---

开发人员，不应该只会Coding 。

应知应会岗位：开发、实施、测试。

 
我们的应用运行在linux 上，很多同事对命令行操作有恐惧感，于是为了分析 linux 上程序的日志，采用的是 FTP+Ultraedit 方法。这种方式不方便、实时性不够，也不够专业。如果碰到几百兆甚至上G 的日志文件，这种分析方式的效率也很成问题，尤其是需要实施跟踪日志的情况下。

 
于是我把在 linux 上分析程序日志的几个常用指令及其配合使用总结一下，希望对大家有所帮助。

 
指令介绍：

**more ：**

作用：该指令，可以将文件的内容，从前向后，每次一屏，打印到终端屏幕上。
用法：

    more filename

显示一屏信息后，' 空格' 向下翻一屏，' 回车' 向下翻一行，' q ' 退出。


**cat ：**

作用：该指令本来的作用，是将多个文件的内容合并起来，打印到标准输出，但最常见的用法是显示一个文件的内容，但文件比较大的情况，屏幕会很快滚动，无法查看有效信息，建议使用 more 。
用法：

    cat filename


**grep ：**

作用：打印文件或者标准输入中符合特定模式的行，该指令是从日志文件中检索特定信息的最有效手段。
用法：

######1、  基本用法

    grep pattern filename

如：

    grep "error" catalina.out

可以将 tomcat 日志 catalina.out 中所有包含 error 的行显示出来

######2、  使用正则表达式

    grep -e "pattern" filename

如：

    grep -e "[eE]rror" catalina.out

可以将 tomcat 日志 catalina.out 中所有包含 error 或者 Error 的行显示出来

######3、  常用选项

-i 匹配时忽略大小写
-n 在打印的行前显示该行在原文件中的行号
-v 该选项，将 grep 的默认行为翻转，打印那些不包含特定模式的行

<!--break-->

**wc ：**

作用：统计文件中的行数、字数和字节数
用法：

    wc filename

如：

    [service@localhost threshold]$ wc nohup.out
       9761028   76738200 1672741676 nohup.out

从前到后的三个数分别是行数、字数、字节数。

该指令比较常用的参数是 -l ，这个参数可以只统计行数

    [service@localhost threshold]$ wc -l nohup.out
       9761028  nohup.out

**head:**

作用：显示文件的开头 N 行
用法：

    head -num filename

如：

    head -100 catalina.out
       
显示 catalina.out 的前 100 行


**tail ：**

作用：显示文件的最后 N 行，或者实时显示文件中新增的内容。
用法：

######1、  显示文件最后 N 行

    tail -num filename

如：

    tail -100 catalina.out

则显示 catalina.out 文件的最后 100 行

######2、  实时显示文件中新增内容

    tail -f filename

如：

    tail -f catalina.out

执行该指令，不会直接返回命令行，而是实时打印日志文件中新增加的内容，这一特性，对于查看日志是非常有效的。如果想终止输出，按 Ctrl+C 即可。


**Linux/unix 的管道：**

管道，顾名思义，你可以把它理解为一个管子，这个管子连接的是前一个指令的输出和后一个指令的输入。管道在命令行上用一个竖线 '|' 表示。
比如 ：

    echo 'hello world'

在屏幕上打印一行字，而

    echo 'hello world' | wc –l

就是把 echo 的输出送给 wc 指令， wc 指令统计行数，输出结果为:
1

 
**组合使用：**

通过分析日志来查找问题，其本质是在日志中寻找特定的模式，并定位该模式的出现的上下文（一般要求前后 N 行）。在实际应用场景中，我们更多的是组合使用前面介绍的指令，来快速定位对我们有用的日志信息。

 
以下场景，我们假定日志文件名为 catalina.out

 
*场景一 ： 实时跟踪日志文件 ， 并过滤出包含特定关键字的日志*

    tail -f catalina.out | grep " 关键字 "

以上指令组合 ， 将 catalina.out 中新增的日志实时取出 ， 通过管道送给 grep 指令 ， grep 指令将其中包含 " 关键字 " 的行显示在 console 上 ， 直到用户按 ctrl+c 退出。管道可以多次连接，所以你可以在后面增加更多的 grep 来得到更加精确的过滤结果。
比如：
       
    tail -f catalina.out | grep " 关键字 " | grep -v "debug"

以上指令组合，将显示所有包含" 关键字" 且不包含" debug " 的行。


*场景二 ：寻找日志中某个异常的 stacktrace 和前后相关信息*

第一步：定位出现异常的行， java 的异常，通常包含 Exception 字样  

    grep -n "Exception" catalina.out
       
       该指令的 -n 参数会打印符合条件的行的行号，示例输出如下：

    [itims@localhost logs]$ grep -n "Exception" catalina.out
    33642:java.lang.NullPointerException
    33910:java.lang.NullPointerException
    34213:java.lang.NullPointerException
    34523:java.lang.NullPointerException
    34597:java.lang.NullPointerException

第二步 ： 截取 Exception 所在行的前后各 10 行。
比如我们想关注 33910 行的 NullPointerException ， 可以用如下指令 ：

    head -33920 catalina.out | tail -20

该指令会得到如下输出 ：

    [itims@localhost logs]$ head -33920 catalina.out | tail -20
    Asia/Shanghai
    CN
    /usr/local/jdk1.5.0_12/jre
    Thu Sep 17 11:13:00 GMT+08:00 2009
    17 Sep 2009 03:13:00 GMT
    2009-9-17 11:13:00
    2009-09-17 11:13:00
    java.util.GregorianCalendar[time=1253157180432,areFieldsSet=true,areAllFieldsSet=true,lenient=true,zone=sun.util.calendar.ZoneInfo[id="GMT+08:00",offset=28800000,dstSavings=0,useDaylight=false,transitions=0,lastRule=null],firstDayOfWeek=1,minimalDaysInFirstWeek=1,ERA=1,YEAR=2009,MONTH=8,WEEK_OF_YEAR=38,WEEK_OF_MONTH=3,DAY_OF_MONTH=17,DAY_OF_YEAR=260,DAY_OF_WEEK=5,DAY_OF_WEEK_IN_MONTH=3,AM_PM=0,HOUR=11,HOUR_OF_DAY=11,MINUTE=13,SECOND=0,MILLISECOND=432,ZONE_OFFSET=28800000,DST_OFFSET=0]
    null
    java.lang.NullPointerException
        at itims.share.db.GlobalTransaction.rollback(GlobalTransaction.java:125)
        at itims.web.frmwk.NetElementService.deleteNetelement(NetElementService.java:292)
        at org.apache.jsp.frmwk.deletene_jsp._jspService(deletene_jsp.java:77)
        at org.apache.jasper.runtime.HttpJspBase.service(HttpJspBase.java:98)
        at javax.servlet.http.HttpServlet.service(HttpServlet.java:729)
        at org.apache.jasper.servlet.JspServletWrapper.service(JspServletWrapper.java:331)
        at org.apache.jasper.servlet.JspServlet.serviceJspFile(JspServlet.java:329)
        at org.apache.jasper.servlet.JspServlet.service(JspServlet.java:265)
        at javax.servlet.http.HttpServlet.service(HttpServlet.java:729)
        at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:269) 