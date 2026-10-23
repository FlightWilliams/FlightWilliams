# 上传到Cloudflare Pages

本包是薪火牌0.18.2的网站版本。ZIP根目录直接包含index.html、assets/和_headers，无需构建命令、后端、数据库或额外下载音轨。

1. 登录https://dash.cloudflare.com/，进入Workers & Pages（有些界面放在Compute / 计算下面）。
2. 点击Create application / 创建应用，找到Pages / Deploy a Pages site，再选择Direct Upload / Upload assets / 直接上传。若同时出现Workers静态资源入口，选择Pages的直接上传流程。
3. 项目名称可用xinhuo-card；名称被占用时加后缀。
4. 上传整个xinhuo-web.zip（或解压后拖入包含index.html与assets的目录）。无需设置构建命令或输出目录。
5. 点击Deploy site / 部署站点，等待页面显示实际的https://项目名.pages.dev地址。
6. 复制实际地址，先用手机流量和微信点开测试，再分享。域名若因重名带后缀，以控制台显示的实际网址为准。

以后更新：在同一个Pages项目创建新的生产部署，重新上传完整网站包；继续使用同一域名。保留旧资源文件可以避免旧缓存引用失效。_headers让HTML重新校验、带内容版本的assets长期缓存；其他平台若忽略此文件，按其面板设置缓存。

Cloudflare的默认域名不保证中国大陆或微信网络可达，也不代表免费使用中国大陆CDN。若仍打不开，应另外选择可达的托管/域名，在所选大陆服务要求下完成备案。套餐、额度及默认域名限制以当前控制台为准。

存档按浏览器和域名保存：迁移至pages.dev不会自动读取旧GitHub Pages的收藏和进度；旧站存档仍留在旧站。更新同一项目及同一网址则保留本地进度。

图像、音效与字体许可见CREDITS.txt。作者：Will Wang。
