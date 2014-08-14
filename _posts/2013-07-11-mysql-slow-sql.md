---
layout: post
title: 【转】mysql查找执行效率慢的SQL语句
category: "mysql"
tags: [mysql,sql]
original: http://hi.baidu.com/bilemick/item/e56f78faa2ba504c922af206
---

启动Mysql时加参数--log-slow-queries来记录执行时间超过long_query_time秒的sql

MySQL 自带 slow log 的分析工具 mysqldumpslow。
slow log 是 MySQL 根据 SQL 语句的执行时间设定，写入的一个文件，用于分析执行较慢的语句。

只要在 my.cnf 文件中配置好：

    log-slow-queries = [slow_query_log_filename]

即可记录超过默认的 10s 执行时间的 SQL 语句。
如果要修改默认设置，可以添加：

    long_query_time = 5

设定为 5s 。

    /usr/sbin/mysqld --basedir=/usr --datadir=/var/lib/mysql --user=mysql --pid-file=/var/run/mysqld/mysqld.pid --skip-locking --port=3306 --socket=/var/run/mysqld/mysqld.sock --log-slow-queries=/var/log/mysql/slow.log

 

####**explain来了解SQL执行的状态。**

    explain select * from wp_posts\G;

explain显示了mysql如何使用索引来处理select语句以及连接表。可以帮助选择更好的索引和写出更优化的查询语句。

使用方法，在select语句前加上explain就可以了：

如：

    explain select surname,first_name form a,b where a.id=b.id

*EXPLAIN列的解释：*

+ table：显示这一行的数据是关于哪张表的
+ type：这是重要的列，显示连接使用了何种类型。从最好到最差的连接类型为const、eq_reg、ref、range、indexhe和ALL
+ possible_keys：显示可能应用在这张表中的索引。如果为空，没有可能的索引。可以为相关的域从WHERE语句中选择一个合适的语句
+ key：实际使用的索引。如果为NULL，则没有使用索引。很少的情况下，MYSQL会选择优化不足的索引。这种情况下，可以在SELECT语句 中使用USE INDEX（indexname）来强制使用一个索引或者用IGNORE INDEX（indexname）来强制MYSQL忽略索引
+ key_len：使用的索引的长度。在不损失精确性的情况下，长度越短越好
+ ref：显示索引的哪一列被使用了，如果可能的话，是一个常数
+ rows：MYSQL认为必须检查的用来返回请求数据的行数
+ Extra：关于MYSQL如何解析查询的额外信息。将在表4.3中讨论，但这里可以看到的坏的例子是Using temporary和Using filesort，意思MYSQL根本不能使用索引，结果是检索会很慢

<!--break-->

*extra列返回的描述的意义*

+ Distinct:一旦MYSQL找到了与行相联合匹配的行，就不再搜索了
+ Not exists: MYSQL优化了LEFT JOIN，一旦它找到了匹配LEFT JOIN标准的行，就不再搜索了
+ Range checked for each Record（index map:#）:没有找到理想的索引，因此对于从前面表中来的每一个行组合，MYSQL检查使用哪个索引，并用它来从表中返回行。这是使用索引的最慢的连接之一
+ Using filesort: 看到这个的时候，查询就需要优化了。MYSQL需要进行额外的步骤来发现如何对返回的行排序。它根据连接类型以及存储排序键值和匹配条件的全部行的行指针来排序全部行
+ Using index: 列数据是从仅仅使用了索引中的信息而没有读取实际的行动的表返回的，这发生在对表的全部的请求列都是同一个索引的部分的时候
+ Using temporary 看到这个的时候，查询需要优化了。这里，MYSQL需要创建一个临时表来存储结果，这通常发生在对不同的列集进行ORDER BY上，而不是GROUP BY上
+ Where used 使用了WHERE从句来限制哪些行将与下一张表匹配或者是返回给用户。如果不想返回表中的全部行，并且连接类型ALL或index，这就会发生，或者是查询有问题不同连接类型的解释（按照效率高低的顺序排序）
+ system 表只有一行：system表。这是const连接类型的特殊情况
+ const:表中的一个记录的最大值能够匹配这个查询（索引可以是主键或惟一索引）。因为只有一行，这个值实际就是常数，因为MYSQL先读这个值然后把它当做常数来对待
+ eq_ref:在连接中，MYSQL在查询时，从前面的表中，对每一个记录的联合都从表中读取一个记录，它在查询使用了索引为主键或惟一键的全部时使用
+ ref:这个连接类型只有在查询使用了不是惟一或主键的键或者是这些类型的部分（比如，利用最左边前缀）时发生。对于之前的表的每一个行联合，全部记录都将从表中读出。这个类型严重依赖于根据索引匹配的记录多少—越少越好
+ range:这个连接类型使用索引返回一个范围中的行，比如使用>或<查找东西时发生的情况
+ index: 这个连接类型对前面的表中的每一个记录联合进行完全扫描（比ALL更好，因为索引一般小于表数据）
+ ALL:这个连接类型对于前面的每一个记录联合进行完全扫描，这一般比较糟糕，应该尽量避免

使用show status like "Handler_read%"; 来了解索引的效果。
Handler_read_key 值高表示索引效果好，Handler_read_rnd_next值高表示索引低效。

####**用show processlist 查看当前运行状态。**

    mysql> show processlist;
    +-----+-------------+--------------------+-------+---------+-------+----------------------------------+----------
    | Id | User | Host            | db   | Command | Time| State     | Info                                                                                          
    +-----+-------------+--------------------+-------+---------+-------+----------------------------------+----------
    |207|root |192.168.0.20:51718 |mytest | Sleep    | 5    |         | NULL                                                                                                
    |208|root |192.168.0.20:51719 |mytest | Sleep    | 5    |         | NULL       
    |220|root |192.168.0.20:51731 |mytest |Query    | 84   | Locked |

    select bookname,culture,value,type from book where id=001

先简单说一下各列的含义和用途，

+ ID列，一个标识，你要kill一个语句的时候很有用，用命令杀掉此查询 /*/mysqladmin kill  进程号。
+ user列，显示单前用户，如果不是root，这个命令就只显示你权限范围内的sql语句。
+ host列，显示这个语句是从哪个ip的哪个端口上发出的。用于追踪出问题语句的用户。
+ db列，显示这个进程目前连接的是哪个数据库。
+ command列，显示当前连接的执行的命令，一般就是休眠（sleep），查询（query），连接（connect）。
+ time列，此这个状态持续的时间，单位是秒。
+ state列，显示使用当前连接的sql语句的状态，很重要的列，后续会有所有的状态的描述，请注意，state只是语句执行中的某一个状态，一个 sql语句，以查询为例，可能需要经过copying to tmp table，Sorting result，Sending data等状态才可以完成，
+ info列，显示这个sql语句，因为长度有限，所以长的sql语句就显示不全，但是一个判断问题语句的重要依据。

这个命令中最关键的就是state列，mysql列出的状态主要有以下几种：

**Checking table**  
正在检查数据表（这是自动的）。  
**Closing tables**   
正在将表中修改的数据刷新到磁盘中，同时正在关闭已经用完的表。这是一个很快的操作，如果不是这样的话，就应该确认磁盘空间是否已经满了或者磁盘是否正处于重负中。  
**Connect Out**  
复制从服务器正在连接主服务器。  
**Copying to tmp table on disk**  
由于临时结果集大于 tmp_table_size，正在将临时表从内存存储转为磁盘存储以此节省内存。  
**Creating tmp table**  
正在创建临时表以存放部分查询结果。  
**deleting from main table**  
服务器正在执行多表删除中的第一部分，刚删除第一个表。  
**deleting from reference tables**  
服务器正在执行多表删除中的第二部分，正在删除其他表的记录。  
**Flushing tables**  
正在执行 FLUSH TABLES，等待其他线程关闭数据表。  
**Killed**  
发 送了一个kill请求给某线程，那么这个线程将会检查kill标志位，同时会放弃下一个kill请求。MySQL会在每次的主循环中检查kill标志位， 不过有些情况下该线程可能会过一小段才能死掉。如果该线程程被其他线程锁住了，那么kill请求会在锁释放时马上生效。  
**Locked**  
被其他查询锁住了。  
**Sending data**  
正在处理 SELECT 查询的记录，同时正在把结果发送给客户端。  
**Sorting for group**  
正在为 GROUP BY 做排序。  
**Sorting for order**  
正在为 ORDER BY 做排序。  
**Opening tables**  
这个过程应该会很快，除非受到其他因素的干扰。例如，在执 ALTER TABLE 或 LOCK TABLE 语句行完以前，数据表无法被其他线程打开。 正尝试打开一个表。  
**Removing duplicates**  
正在执行一个 SELECT DISTINCT 方式的查询，但是MySQL无法在前一个阶段优化掉那些重复的记录。因此，MySQL需要再次去掉重复的记录，然后再把结果发送给客户端。  
**Reopen table**  
获得了对一个表的锁，但是必须在表结构修改之后才能获得这个锁。已经释放锁，关闭数据表，正尝试重新打开数据表。  
**Repair by sorting**  
修复指令正在排序以创建索引。  
**Repair with keycache**  
修复指令正在利用索引缓存一个一个地创建新索引。它会比 Repair by sorting 慢些。  
**Searching rows for update**  
正在讲符合条件的记录找出来以备更新。它必须在 UPDATE 要修改相关的记录之前就完成了。  
**Sleeping**  
正在等待客户端发送新请求.  
**System lock**  
正在等待取得一个外部的系统锁。如果当前没有运行多个 mysqld 服务器同时请求同一个表，那么可以通过增加 --skip-external-locking参数来禁止外部系统锁。  
**Upgrading lock**  
INSERT DELAYED 正在尝试取得一个锁表以插入新记录。  
**Updating**  
正在搜索匹配的记录，并且修改它们。  
**User Lock**  
正在等待 GET_LOCK()。  
**Waiting for tables**  
该线程得到通知，数据表结构已经被修改了，需要重新打开数据表以取得新的结构。然后，为了能的重新打开数据表，必须等到所有其他线程关闭这个表。以下几种情况下会产生这个通知：FLUSH TABLES tbl_name, ALTER TABLE, RENAME TABLE, REPAIR TABLE, ANALYZE TABLE, 或 OPTIMIZE TABLE。  
**waiting for handler insert**  
INSERT DELAYED 已经处理完了所有待处理的插入操作，正在等待新的请求。

大部分状态对应很快的操作，只要有一个线程保持同一个状态好几秒钟，那么可能是有问题发生了，需要检查一下。
还有其他的状态没在上面中列出来，不过它们大部分只是在查看服务器是否有存在错误是才用得着。

mysql手册里有所有状态的说明，链接如下：http://dev.mysql.com/doc/refman/5.0/en/general-thread-states.html

中文说明取自http://www.linuxpk.com/5747.html
