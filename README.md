ueditor-qiniu-node
=================

支持UEditor连接到七牛的NodeJS服务，支持上传图片、上传涂鸦、上传视频、上传附件、图片列表、文件列表功能



----------


#### 安装依赖

```bash
$ cd <project-path>
$ sudo npm install
```


#### 配置七牛账户

编辑 config.js 文件中的"qiniuAccessKey"为<code>Access Key</code>值，"qiniuSecretKey"为<code>Secret Key</code>值，"qiniuBucket"为<code>七牛的空间名</code>值，"qiniuBucketUrl"为<code>外网访问七牛空间的URL</code>值
> 注意，需将该七牛空间设置为可以公开访问


#### 启动服务

```bash
$ cd <project-path>
$ node main.js
```


#### 访问示例

在浏览器中访问 http://localhost:3999/static/ueditor/index.html


#### 集成到你的NodeJS工程

0. 使用nginx等反向代理工具将你的工程和本工程集成到同一域名下
0. 可以使用更新的UEditor，注意修改其根目录下的ueditor.config.js中的"serverUrl"为正确的URL







