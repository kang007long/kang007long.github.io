---
layout: post
title: 【转】EasyMock, PowerMock 一起mock静态方法 static method
category: "java"
tags: [java, junit, 单元测试]
original: http://jwu.iteye.com/blog/1745478
---

在哪下载包就不说了，要下这么几个：

easymock-3.1  
easymockclassextension-3.1  
powermock-easymock-junit-1.5  


创建一个待会儿被mock的类， Job

{% highlight java linenos %}
    package com.jwu.mock;  
      
    import java.util.Random;  
      
    public class Job {  
      
        public Job(String name) {  
            this.name = name;  
        }  
      
        private String name;  
      
        public String getName() {  
            return name;  
        }  
      
        public static int generateId() {  
            return new Random().nextInt(1000);  
        }  
      
    }  
{% endhighlight %}
<!--break--> 

再创建一个待会儿需要测试的类，该被测试的类需要用到被mock的类，Person

{% highlight java linenos %}
    package com.jwu.mock;  
      
    public class Person {  
      
        private int id;  
        private String name;  
        private Job job;  
      
        public Person() {  
            this(1, "noname", new Job("nojob"));  
        }  
      
        public Person(int id, String name, Job job) {  
            this.id = id;  
            this.name = name;  
            this.job = job;  
        }  
      
        public String getJobName() {  
            return job.getName();  
        }  
      
        public int getJobId() {  
            return Job.generateId();  
        }  
      
        public String getJobNamePrefixId() {  
            return getJobId() + getJobName();  
        }  
      
        public String toString() {  
            return "#" + id + ": " + name;  
        }  
    }  
{% endhighlight %}
 
<!--break-->

然后开始写UT类，这里演示了使用EasyMock去mock普通方法，和PowerMock去模拟静态方法：

{% highlight java linenos %}
    package com.jwu.mock;  
      
    import static org.junit.Assert.assertEquals;  
      
    import org.easymock.EasyMock;  
    import org.junit.Test;  
    import org.junit.runner.RunWith;  
    import org.powermock.api.easymock.PowerMock;  
    import org.powermock.core.classloader.annotations.PrepareForTest;  
    import org.powermock.modules.junit4.PowerMockRunner;  
      
    @RunWith(PowerMockRunner.class)  
    @PrepareForTest(Job.class)  
    public class MockStaticTest {  
      
        @Test  
        public void testMockMethod() {  
            Job job = EasyMock.createMock(Job.class);  
            String jobName = "owen";  
            EasyMock.expect(job.getName()).andReturn(jobName);  
            EasyMock.replay(job);  
      
            Person person = new Person(123, "testName", job);  
            assertEquals(person.getJobName(), jobName);  
        }  
      
        @Test  
        public void testStatic() {  
            Job job = EasyMock.createMock(Job.class);  
            int expectId = 1234;  
            PowerMock.mockStatic(Job.class);  
            EasyMock.expect(Job.generateId()).andReturn(expectId);  
            PowerMock.replay(Job.class);  
      
            Person person = new Person(123, "testName", job);  
      
            assertEquals(person.getJobId(), expectId);  
        }  
      
        @Test  
        public void testMix() {  
            Job job = EasyMock.createMock(Job.class);  
            int expectId = 1234;  
            PowerMock.mockStatic(Job.class);  
            EasyMock.expect(Job.generateId()).andReturn(expectId);  
            PowerMock.replay(Job.class);  
            String jobName = "owen";  
            EasyMock.expect(job.getName()).andReturn(jobName);  
            EasyMock.replay(job);  
      
            Person person = new Person(123, "testName", job);  
      
            assertEquals(person.getJobNamePrefixId(), expectId + jobName);  
        }  
    }  
{% endhighlight %}
 

没有什么特别的，工具和包看一下就会了，真正重要的是怎么去设计UT。
