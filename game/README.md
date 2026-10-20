# 薪火牌 · 自适应牌桌试玩版 0.5.1

`index.html` 是完整游戏，图像、GIF、音效全部内嵌，无需安装依赖或配置后端。`xinhuo-demo.zip` 是可下载的发布包。

## 试玩与下载

- GitHub Pages 部署完成后的游戏路径：[/FlightWilliams/game/](https://flightwilliams.github.io/FlightWilliams/game/)
- [下载试玩 ZIP](https://github.com/FlightWilliams/FlightWilliams/raw/refs/heads/main/game/xinhuo-demo.zip)，解压后用浏览器打开 `index.html`。

## 自适应牌桌

桌面使用宽牌桌与侧边信息栏；手机使用紧凑生命栏、五格战场和底部操作区。主牌桌按可视窗口高度布局；手牌较多时局部横向滑动。规则、战斗记录与完整卡牌说明通过独立滚动面板查看。

增加动态可视高度、iPhone安全区域与横竖屏切换适配。手机主要按钮至少44px，姓名输入文字16px。作者Will Wang以11px金色小字位于首页最下方。

已在Chromium验证1920×1080、1366×768、1280×720、390×664、393×759、375×635、320×568、844×390，并模拟安全区与工具栏压缩后的可视高度。尚未进行真实iPhone Safari测试。

![桌面牌桌](preview-desktop.png)

<details>
<summary>查看手机布局</summary>

![手机牌桌](preview-iphone.png)

</details>

## 取消选择与双方布局

选错时按鼠标右键或Esc，即可清除手牌、祭品和位移选择；手机点击“取消”。已经完成的出牌或移动不会撤回，结算和抽牌动画期间不执行取消。首页也显示这条操作说明。

双方生命栏左对齐、宽度一致；双方牌库统一在各自生命栏右侧，牌堆尺寸、叠层和计数布局保持一致。

## 规则与进阶

双方五张起手、五格战场、七点生命；横移、换位、击退、守护、吸血、持续伤害等能力采用统一结算。880张同人卡牌可在图鉴中搜索和组牌。卡表尚未逐项穷尽或核对全部官方角色与变体。

难度按余火 → 薪火 → 深渊顺序推进，通关当前16关才开启下一档。晋阶记录保存在当前浏览器，当前对局不自动续存。

## 视觉参考

参考[Wesnoth古铜按钮](https://github.com/wesnoth/wesnoth/tree/master/images/buttons)与[Forge卡牌桌面](https://github.com/Card-Forge/forge/tree/master/forge-gui/res/skins/default)，使用原创CSS实现烟熏木色、黄铜细框、炭黑刻槽和旧金按钮，未复制参考项目图像进游戏。详情见[设计参考](DESIGN.md)。
