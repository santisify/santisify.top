---
title: 'Restful API Tips'
tags: ['技术','API']
publishDate: '2025-03-21 16:36:32'
description: 'API设计小Tips'
heroImage: { src: './iv/apifox.svg', color: '#4891B2' }
language: 'zh-cn'
---
## API请求
### HTTP动词
```http
GET:     读取（READ）
POST:    新建（CREATE）
PUT:     更新（UPDATE）
DELETE:  删除（DELETE）
```
> PATCH 部分更新

### URL宾语
**宾语** 顾名思义，是一个名词，`URL`作为`API`的宾语是作用`HTTP`的对象，普遍以复数形式存在.

以下为错误示例：
```http
/getAllCars
/createNewCar
/deleteAllRedCars
```

正确示例：
```HTTP
/aticles
/users
/cars
```

#### 煮个栗子
```http
 GET    /zoos：列出所有动物园
 POST   /zoos：新建一个动物园
 GET    /zoos/ID：获取某个指定动物园的信息
 PUT    /zoos/ID：更新某个指定动物园的信息（提供该动物园的全部信息）
 PATCH  /zoos/ID：更新某个指定动物园的信息（提供该动物园的部分信息）
 DELETE /zoos/ID：删除某个动物园
 GET    /zoos/ID/animals：列出某个指定动物园的所有动物
 DELETE /zoos/ID/animals/ID：删除某个指定动物园的指定动物
```

### 过滤（filter）
通常在数据库中存储着许多数据，我们不可能将所有数据返回给用户，而是选择性的将一些数据返回给用户，而`API`就应该提供一些参数，过滤返回的结果。

下面是一些常见的参数。
```http
?limit=10：指定返回记录的数量
?offset=10：指定返回记录的开始位置。
?page=2&per_page=100：指定第几页，以及每页的记录数。
?sortby=name&order=asc：指定返回结果按照哪个属性排序，以及排序顺序。
?animal_type_id=1：指定筛选条件
```

参数的设计允许存在冗余，即允许API路径和URL参数偶尔有重复。比如，`GET /zoo/ID/animals` 与 `GET /animals?zoo_id=ID` 的含义是相同的。

### 不符合 CRUD 情况的 RESTful API
在实际资源操作中，总会有一些不符合 CRUD 的情况，一般有几种处理方法。
- 1、使用 POST，为需要的动作增加一个 endpoint，使用 POST 来执行动作，比如: POST /resend 重新发送邮件。
- 2、增加控制参数，添加动作相关的参数，通过修改参数来控制动作。比如一个博客网站，会有把写好的文章“发布”的功能，可以用上面的 `POST /articles/{:id}/publish` 方法，也可以在文章中增加 `published:boolean` 字段，发布的时候就是更新该字段 `PUT /articles/{:id}?published=true`
- 3、把动作转换成资源，把动作转换成可以执行 CRUD 操作的资源， github 就是用了这种方法。
比如“喜欢”一个 gist，就增加一个 `/gists/:id/star` 子资源，然后对其进行操作：“喜欢”使用`PUT /gists/:id/star`，“取消喜欢”使用 `DELETE /gists/:id/star`。
另外一个例子是 Fork，这也是一个动作，但是在 gist 下面增加 forks资源，就能把动作变成 CRUD 兼容的：`POST /gists/:id/forks` 可以执行用户 fork 的动作。

### 动词覆盖，应对服务器不完全支持 HTTP 的情况
有些客户端只能使用GET和POST这两种方法。服务器必须接受POST模拟其他三个方法（PUT、PATCH、DELETE）。
这时，客户端发出的 HTTP 请求，要加上X-HTTP-Method-Override属性，告诉服务器应该使用哪一个动词，覆盖POST方法。

## API响应

### 状态码
#### 2xx 状态码
`200`状态码也称成功状态码，但是对于不同的方法又有不同的状态码
- GET --> `200` OK
- POST--> `201` Created（表示生成新的资源）
- PUT --> `200` OK
- PATCH --> `200` OK
- DELETE --> `204` No Content（表示该资源已不存在）
#### 3xx 状态码
在**Restful API**中用不上，永久重定向（`301`）、暂时重定向（`302`、`307`）可由应用级别返回，浏览器直接跳转。
主要使用`303` see other，以表示参考另一个URL，它与302和307的含义一样，也是”暂时重定向”，区别在于302和307用于GET请求，而303用于POST、PUT和DELETE请求。收到303以后，浏览器不会自动跳转，而会让用户自己决定下一步怎么办。
#### 4xx 状态码
`4xx` 状态码表示客户端错误，主要有下面几种：

1. `400` --> Bad Request：服务器不理解客户端的请求，未做任何处理。
2. `401` --> Unauthorized：用户未提供身份验证凭据，或者没有通过身份验证。
3. `403` --> Forbidden：用户通过了身份验证，但是不具有访问资源所需的权限。
4. `404` --> Not Found：所请求的资源不存在，或不可用。
5. `405` --> Method Not Allowed：用户已经通过身份验证，但是所用的 HTTP 方法不在他的权限之内。
6. `410` --> Gone：所请求的资源已从这个地址转移，不再可用。
7. `415` --> Unsupported Media Type：客户端要求的返回格式不支持。比如，客户端要求返回XML格式，API只能返回JSON格式。
8. `422` --> Unprocessable Entity ：客户端上传的附件无法处理，导致请求失败。
9. `429` --> Too Many Requests：客户端的请求次数超过限额。

#### 5xx 状态码
`5xx`状态码表示服务端错误。一般来说，**API**不会向用户透露服务器的详细信息，所以只要两个状态码就够了。
1. `500` --> Internal Server Error：客户端请求有效，服务器处理时发生了意外。
2. `503` --> Service Unavailable：服务器无法处理请求，一般用于网站维护状态。

### 返回数据
以下事项均为注意事项，不要问为什么，因为站长在学之前全都犯过。
#### 不要返回纯本文
`API` 返回的数据格式，不应该是纯文本，而应该是一个 JSON 对象，因为这样才能返回标准的结构化数据。所以，服务器回应的 HTTP 头的**Content-Type**属性要设为`application/json`。
客户端请求时，也要明确告诉服务器，可以接受 JSON 格式，即请求的 HTTP 头的ACCEPT属性也要设成`application/json`。
#### 不要包装数据
response 的 body直接就是数据，不要做多余的包装。错误实例：
```json
{
	"success":true, 
	"data":{
		"id":1,
		"name":"周伯通"
	} 
}
```

针对不同操作，服务器向用户返回的结果应该符合以下规范。
```http
 GET    /collection：返回资源对象的列表（数组）
 GET    /collection/resource：返回单个资源对象
 POST   /collection：返回新生成的资源对象
 PUT    /collection/resource：返回完整的资源对象
 PATCH  /collection/resource：返回完整的资源对象
 DELETE /collection/resource：返回一个空文档
```

#### 发生错误时，不要返回 200 状态码
有一种不恰当的做法是，即使发生错误，也返回200状态码，把错误信息放在数据体里面，就像下面这样。
```json
{
	"status": "failure", 
	"data": { 
		"error": "Expected at least two items in list."
	}
}
```
正确的做法是，状态码反映发生的错误，具体的错误信息放在数据体里面返回。下面是一个例子。
```json
HTTP/1.1 400 Bad Request
Content-Type: application/json
{
  "error": "Invalid payoad.",
  "detail": {
    "surname": "This field is required."
  }
}
```
