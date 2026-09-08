---
title: 'annotation aop and transaction'
tags: ['java', 'spring']
publishDate: '2026-09-02 21:22:45'
description: '主要内容为spring boot 下的注解，AOP和事物'
language: 'zh-cn'
series: "java"
comment: false
---

Spring 导入三方组件方法：(无法快速标注分层注解)
1. @Bean：自己手动 `new` 对象，使用 `@Bean` 注解注册到容器
```java 
@Bean  
public CoreConstants coreConstants(){  
    return new CoreConstants();  
}
```

2. @Import：在配置类中添加 `@import(package.class)` 在配置类中添加主要是代码美观性
```java
@Import(CoreConstants.class)  
@Configuration  
public class AppConfig {  
}
```
### 不常用注解
#### @Scope
@Scope 用于调整组件作用域：
1. @Scope("prototype") 非单实例，容器启动时不会创建非单实例组件对象，使用时创建
2. @Scope("singleton") 单实例，默认值，容器启动完成前创建完成
3. @Scope("request") 同一个请求单实例
4. @Scope("session") 同一个会话单实例
#### @Lazy
@Lazy 懒加载：
容器启动完成前不会创建懒加载组件的对象，什么时候获取，什么时候创建

#### FactoryBean
需要创建比较复杂的对象可使用FactoryBean来创建
在容器中注册的组件类型是接口中的泛型的类型，组件的名字仍是Factory的类名
```java
@Component  
public class Factory implements FactoryBean<Car> {  
    /**  
     * 调用该方法给容器创建对象     
     * @return Car  
     * @throws Exception  
     */  
    @Override  
    public @Nullable Car getObject() throws Exception {  
        Car c = new Car();  
        return c;  
    }  
    /**  
     * 返回对象类型     
     * @return class  
     */    
    @Override  
    public @Nullable Class<?> getObjectType() {  
        return Car.class;  
    }  
    /**  
     * 是否为单实例     
     * @return true:单例, false: 非单例  
     */    @Override  
    public boolean isSingleton() {  
        return true;  
    }  
}
```

```java
@SpringBootApplication  
public class Spring01IocApplication {  
    public static void main(String[] args) {  
        ConfigurableApplicationContext ioc = SpringApplication.run(Spring01IocApplication.class, args);  
        Car carBean = ioc.getBean(Car.class);  
        System.out.println("carBean = " + carBean);  
    }  
}
```

输出结果为：`carBean = com.santisify.springioc.dao.Car@30135202`

#### @Conditional
@Conditional 条件注册
```java
public class WindowsConditional implements Condition {  
    @Override  
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {  
        String osName = context.getEnvironment().getProperty("OS");  
        if (osName != null && osName.contains("Windows")) {  
            return true;  
        }  
        return false;  
    }  
}
```

```java
public class LinuxConditional implements Condition {  
    @Override  
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {  
        String osName = context.getEnvironment().getProperty("OS");  
        if (osName != null && osName.contains("Linux")) {  
            return true;  
        }  
        return false;  
    }  
}
```

```java
@Configuration  
public class OSConfig {  
    @Conditional(LinuxConditional.class)  
    @Bean("linux")  
    public OS linux () {  
        OS os = new OS();  
        os.setSystemName("linux");  
        return os;  
    }  
    @Conditional(WindowsConditional.class)  
    @Bean("windows")  
    public OS windows() {  
        OS os = new OS();  
        os.setSystemName("windows");  
        return os;  
    }  
}
``` 

## AOP 面向切面编程

常见的两种编程思想：
- AOP（Aspect Oriented Programming）面向切面编程   依赖于IOC
- OOP（Object Oriented Programming）面向对象编程   class抽象表示对象

切面：也属于class，在不改变原有代码基础上进行增强（额外运行切面中的代码）
### AOP的核心概念及术语
目标对象（Target）：指将要被增强的对象，即包含业务逻辑类的对象
> 通常会有对个目标对象

切面（Aspect）：指关注点模块化，切点可能会横切对个对象。在SpringAOP中切面可以使用通用类基于模式的方式或者在普通类中以 `@Aspect` 注解来实现

通知（Advice）：切面中的某个特定的连接点上执行的动作。通知分为`around`、`before`、`after`等。大多数AOP框架都是以拦截器做通知模型，并维护着一个以连接点为中心的拦截器链。
> 用于增强代码的方法
> - 环绕通知`@Around`：把增强代码放在目标方法的任意地方。该通知是最通用的。
> - 前置通知`@Before`：将增强代码放在目标方法之前。
> - 后置通知`@After`：将增强代码放在目标方法之后。
> - 异常通知`@AfterThrowing`：目标方法出现异常时执行。
> - 返回通知`@AfterReturning`：目标方法返回值执行。

切点（Pointcut）：匹配连接点的断言。通知和切点表达式相关联，并在满足这个切点的连接点上运行。
> 切点表达式如何和连接点匹配是AOP的核心：Spring默认使用AspectJ切点语义。
>
> 增强到目标方法具体匹配，切点表达式

连接点（Join point）：在SpringAOP中，一个连接点是代表一个方法的执行，其实就代表增强的方法
> 通知和目标方法的一个桥梁，要获取目标方法的信息，就得需要JoinPoint
>


### @Aspect
子模块中添加依赖
```xml
// springboot3
<dependency>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starter-aop</artifactId>  
</dependency>

//springboot4
<dependency>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starter-aspectj</artifactId>  
</dependency>
```

`UserService.java`:
```java
package com.santisify.aop;  
  
import org.springframework.stereotype.Service;  
  
@Service  
public class UserService {  
    public void add() {  
        System.out.println("add");  
    }  
  
    public void delete() {  
        System.out.println("delete");  
    }  
  
    public void update() {  
        System.out.println("update");  
    }  
  
    public void query() {  
        System.out.println("query");  
    }  
  
}
```
`LogAspect.java`:
```java
package com.santisify.aop;  
  
import org.aspectj.lang.ProceedingJoinPoint;  
import org.aspectj.lang.annotation.Around;  
import org.aspectj.lang.annotation.Aspect;  
import org.springframework.stereotype.Component;  
  
@Aspect //标记切面类  
@Component  //必须为Bean
public class LogAspect {
    // 定义切点  
    // 表达式含义    
    // execution: 执行    
    // *: 代表切入方法的访问权限符    
    // com.santisify.aop.UserService: 切入的类    
    // .*: 任意方法    
    // (..): 任意参数   
    @Around("execution(* com.santisify.aop.UserService.*(..))")  
    public void log(ProceedingJoinPoint proceedingJoinPoint) {  
        long begin = System.currentTimeMillis();  
        try {  
            proceedingJoinPoint.proceed(); // 执行目标方法  
        } catch (Throwable e) {  
            System.out.println("异常:" + e.getMessage());  
        }  
        long end = System.currentTimeMillis();  
  
        System.out.println("耗时：" + (end - begin) + "ms");  
    }  
}
```

### @EnableAspectJAutoProxy
该注解为启用AOP,无该注解AOP功能无法使用

@EnableAspectJAutoProxy 是否一定要加？为什么没加AOP也可使用？
> springboot会自动为我们加上该注解。
>
> Spring Boot 的自动配置类 `AopAutoConfiguration` 位于 `spring-boot-autoconfigure` 模块中，它根据类路径和配置条件决定是否启用 AOP。
>
> ```java
> @Configuration(proxyBeanMethods = false)
@ConditionalOnProperty(prefix = "spring.aop", name = "auto", havingValue = "true", matchIfMissing = true)
public class AopAutoConfiguration {
>    @Configuration(proxyBeanMethods = false)
>    @ConditionalOnClass({ EnableAspectJAutoProxy.class, Aspect.class, Advice.class, AnnotatedElement.class })
>    @ConditionalOnProperty(prefix = "spring.aop", name = "proxy-target-class", havingValue = "true", matchIfMissing = true)
>    static class AspectJAutoProxyingConfiguration {
>        @Bean
>      @ConditionalOnMissingBean
>     public AnnotationAwareAspectJAutoProxyCreator aspectJAwareAdvisorAutoProxyCreator() {
>            // 核心：创建 AnnotationAwareAspectJAutoProxyCreator，相当于启用了 @EnableAspectJAutoProxy
>            return new AnnotationAwareAspectJAutoProxyCreator();
>        }
>    }
>    // 其他配置...
>}
> ```

## 事务

一组关联的数据库操作
![Drawing 2026-09-02 19.59.54.excalidraw.png](assets/Drawing%202026-09-02%2019.59.54.excalidraw.png)
### 四大特性 ACID
**A** 原子性：在一组业务操作下要么成功要么失败，也就是说在一组数据库操作中要么都提交要么都回滚
**C** 一致性：事务前后的数据都要保证数据的一致性
**I** 隔离性：在并发情况下，事务之间要相互隔离
**D** 持久行：数据一旦保存就是持久的
### SpringBoot中操作数据库
添加依赖项
```xml
<!-- jdbc-api   数据库必须的依赖 -->
<dependency>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starter-jdbc</artifactId>  
</dependency>  
<!-- mysql驱动 -->
<dependency>  
    <groupId>com.mysql</groupId>  
    <artifactId>mysql-connector-j</artifactId>  
    <scope>runtime</scope>  
</dependency>  

<dependency>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starter-jdbc-test</artifactId>  
    <scope>test</scope>  
</dependency>
```

配置`datasource`
```yml
spring:  
  datasource:  
    url: jdbc:mysql://localhost:3306/test?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=UTC  
    username: root  
    password: 123456  
    driver-class-name: com.mysql.cj.jdbc.Driver
```

测试数据库是否可以正常连接。
```java
@SpringBootTest  
class TransactionApplicationTests {  
    @Test  
    void MysqlConnect(@Autowired DataSource datasource) throws SQLException {  
        System.out.println(datasource.getConnection());  
    }  
  
}
```
若可以正常连接可在控制台看见类似于这样的输出：
```txt
HikariProxyConnection@997657863 wrapping com.mysql.cj.jdbc.ConnectionImpl@6e2eead5
```

`DataSource` ：DataSource是一个接口提供了一种标准方式获取数据库连接，其提供了一个getConnection方法，使得我们使用就不需要关心连接的提供方式。

DriverManager也是一种连接方式，但是通过这个方式每一次连接都是一个远程网络连接。

DataSource同时提供连接池（Hikari、Druid、……）和DriverManager等连接方式

连接池：是一种管理数据库的技术，通过缓存和重复利用连接，减少应用程序与数据库交互时的连接创建和关闭开销。同时连接池还能控制连接数量，有效管理系统资源。

### Spring中操作数据库

<div id="sify-gist-onwppExr95Tp"></div>
<script src="https://gist.santisify.top/api/gists/onwppExr95Tp/embed.js"></script>

