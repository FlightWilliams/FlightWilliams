# 薪火牌：欧美复古牌桌与按钮参考

本次以公开项目的真实 UI 素材作结构参考，游戏中的材质与按钮用原创 CSS 绘制。参考文件只保存在开发目录 `dev/reference-assets/`，不直接复制进发布游戏。

## 已实际访问并查看的参考

### 1. The Battle for Wesnoth：古铜多层边框与凹面按钮

- 官方项目目录：[wesnoth/wesnoth — images/buttons](https://github.com/wesnoth/wesnoth/tree/master/images/buttons)
- 返回：HTTP 200。实际页面标题为 `wesnoth/images/buttons at master · wesnoth/wesnoth · GitHub`。
- 已下载并查看：[large-button.png](https://raw.githubusercontent.com/wesnoth/wesnoth/master/images/buttons/large-button.png) 和 [large-button-active.png](https://raw.githubusercontent.com/wesnoth/wesnoth/master/images/buttons/large-button-active.png)，均 HTTP 200。
- 观察：窄金属外边、内层细亮线、深色内凹按钮面；悬停状态增加内层亮度和侧部指示，不改变控件尺寸。
- 应用于薪火牌：用烟熏木褐替换原参考蓝色，保留黄铜细边、四角折线、内侧阴影；主要行动按钮用旧金色，其余按钮保持深铜色。按钮状态靠边框和亮度变化表达，避免放大后挤占空间。

### 2. The Battle for Wesnoth：低对比深色面板

- 官方目录：[images/dialogs](https://github.com/wesnoth/wesnoth/tree/master/images/dialogs)，HTTP 200。
- 已下载并查看：[opaque-background.png](https://raw.githubusercontent.com/wesnoth/wesnoth/master/images/dialogs/opaque-background.png)，HTTP 200。
- 观察：非常细密、低对比的暗面板，目的是托起文字与交互，而非吸引视线。
- 应用于薪火牌：外围有木纹与铜边，战场中央只保留柔和暗面和雕刻槽线。装饰不能与羊皮纸卡牌的标题、攻血数值争抢对比度。

### 3. Forge：卡牌桌面材料与按钮状态分层

- 项目目录：[Card-Forge/forge — default skin](https://github.com/Card-Forge/forge/tree/master/forge-gui/res/skins/default)
- 返回：HTTP 200。实际页面标题为 `forge/forge-gui/res/skins/default at master · Card-Forge/forge · GitHub`。
- 已下载并查看：[sprite_buttons.png](https://raw.githubusercontent.com/Card-Forge/forge/master/forge-gui/res/skins/default/sprite_buttons.png)、[bg_match.jpg](https://raw.githubusercontent.com/Card-Forge/forge/master/forge-gui/res/skins/default/bg_match.jpg)、[bg_texture.jpg](https://raw.githubusercontent.com/Card-Forge/forge/master/forge-gui/res/skins/default/bg_texture.jpg)，均 HTTP 200。
- 观察：按钮以高光、阴影和饱和度分成多个交互状态；牌桌使用深色矿石与裂纹材料，让卡牌的浅色表面更突出。原按钮蓝色塑料感较强，不适合照搬本作。
- 应用于薪火牌：采用其“交互状态分层、外围材料重、核心操作区轻”的方式；按钮改为哑光铜与旧金，牌桌改为深棕木面、炭黑刻槽和少量烛光。卡牌保持纸质亮面，强化桌面与卡面的层次。

## 推荐的薪火牌视觉语汇

- 牌桌：深胡桃木 `#21160f` / 炭黑 `#100d09`，细长木纹与柔和中央烛光。
- 外框：氧化黄铜 `#755431`，只在边缘加入 `#bc9355` 细亮线。
- 主按钮：旧金 `#b18340`，小范围暖色高光，不使用大面积亮黄。
- 普通按钮：深木褐底、双层细铜边；危险／献祭使用暗红标记。
- 槽位：浅刻铜线、内凹暗边、角部小刻痕，卡牌本身可保留羊皮纸色。
- 文字：统一中文衬线字体，标题稍疏、正文与数值清楚；作者 `Will Wang` 维持首页底部 11px 金色。
- 装饰密度：只在页角、牌桌框和主按钮使用，避免在手机的小卡面上堆叠。
- 手机：头部工具收敛，生命显示横向压缩；手牌区横向滚动，动作按钮固定在牌桌底部；不以整页缩放解决内容过多。

## 商业作品的补充参考链接（本次未成功读取）

下列链接可由用户浏览器打开参考，但本环境代理返回 403，**不能声称本次已浏览或截图**：

- [Inscryption — Steam](https://store.steampowered.com/app/1092790/Inscryption/)
- [Hand of Fate 2 — Steam](https://store.steampowered.com/app/456670/Hand_of_Fate_2/)
- [Hearthstone 官方站](https://hearthstone.blizzard.com/en-us/)

本次可验证的来源为上述开源项目仓库及实际查看过的原始素材，成品不依赖商业网站的素材加载。
