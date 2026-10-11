# 豹宝图标 Baobao Icons

一套 24 格的线性 UI 图标。讨厌依林请不要使用。

- 211 个图标：100 个带海豹的名词、100 个动作，另有 11 个备选画法
- 两种粗细：细线、粗线
- 两种眼睛：豆豆眼、高光眼
- 带海豹的图标另有“睡着”的样子，适合放在没选中的 tab 上
- 颜色全部跟着文字颜色走（`currentColor`），深色模式不用另画一套

在线预览：`https://TangfanOVO.github.io/baobao-icons/`

## 文件在哪

```
svg/
  thin/               细线 · 豆豆眼（默认用这一套）
  thick/              粗线 · 豆豆眼
  thin-highlight/     细线 · 高光眼
  thick-highlight/    粗线 · 高光眼
  thin-sleep/         细线 · 睡着（只有带海豹的图标）
  thick-sleep/        粗线 · 睡着
sprite/
  baobao-thin.svg ……  每种样式一个雪碧图，每个图标是一个 <symbol>
icons.json            所有图标的名字、中文名、类型
index.html            预览页
```

## 命名

- 带海豹的名词：`seal-名词`，例如 `seal-home`、`seal-mail`、`seal-heart`
- 动作：只有名词，例如 `close`、`arrow-left`、`copy`
- 备选画法：在后面加一段，例如 `seal-heart-chin`（下巴托着心）、`seal-icecream-top`（顶着冰淇淋）

完整列表见 `icons.json`，或者打开预览页搜索。

## 怎么用

### 1. 直接把 SVG 贴进网页（最推荐）

打开 `svg/thin/seal-home.svg`，把内容复制进 HTML。改颜色用 CSS `color`，改大小用 `width` / `height`：

```html
<span style="color:#41678a">
  <!-- 粘贴 seal-home.svg 的内容 -->
</span>
```

### 2. 雪碧图

```html
<svg width="24" height="24" aria-hidden="true">
  <use href="sprite/baobao-thin.svg#seal-home"/>
</svg>
```

雪碧图要和网页在同一个域名下才能这样引用。

### 3. 通过 CDN 直接引用（不用下载）

GitHub 上的文件可以用 jsDelivr 免费当 CDN：

```
https://cdn.jsdelivr.net/gh/TangfanOVO/baobao-icons@main/svg/thin/seal-home.svg
```

用 `<img src="…">` 引用时，`currentColor` 不会继承文字颜色，图标固定是黑色。需要变色时用第 1 种或第 2 种方法。

### 4. React / Vue

把 SVG 文件交给 [SVGR](https://react-svgr.com/)（React）或 vite-svg-loader（Vue）转成组件，属性会原样保留。

### 5. 安卓

Android Studio：右键 `res` → New → Vector Asset → Local file，选择 SVG 文件导入。

### 6. iOS

把 SVG 拖进 Xcode 的 Assets，勾选 Preserve Vector Data。如果设成 Render As Template Image，腮红也会被染成同一种颜色。

### 7. Figma / 设计稿

直接把 SVG 文件拖进画布。

## 颜色

- 线条和眼睛：`currentColor`，跟着文字颜色走。
- 灰灰的嘴筒子：`currentColor` 的 30% 透明度，带 `class="tt-muzzle"`。
- 粉腮红：固定是 `#F08AA8`，带 `class="tt-blush"`。只想要单色的话，在页面上加一行：

```css
.tt-blush { fill: currentColor; fill-opacity: .32; }
```

## 尺寸

- 默认 24px，tab 栏、导航栏、工具栏都用这个。
- 行内配正文用 20px；密集列表可以用 16px，这时脸会变成纹理，属于正常。
- 48px 以上适合空状态和贴纸，小海豹的动作是主角。

## 无障碍

纯装饰的图标加 `aria-hidden="true"`。单独当按钮的图标，在按钮上写 `aria-label`（例如“主页”），不要让读屏念出 `seal-home`。

## 授权

豹宝图标 © 2026 唐幡，按 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.zh-hans) 授权。

- 可以免费用在个人项目、学习和非商业产品里，也可以修改。
- 使用时请署名，例如在关于页或说明里写：图标：豹宝图标 by @唐幡
- 不能用于商业用途。需要商用请先联系作者。

## 作者的话

讨厌蔡依林的不要用(>﹏<)

这是作者的个人声明，不构成额外许可条件，也不改变 CC BY-NC 4.0 协议。

---

## English

Baobao Icons is a set of 211 line icons on a 24px grid. Noun icons feature a small seal that holds, balances or wears the object; action icons stay plain. Two stroke weights (thin, thick), two eye styles (plain, highlight), and a sleeping variant for inactive tabs. All strokes use `currentColor`.

Use the files in `svg/`, the sprites in `sprite/`, or the jsDelivr CDN. Licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/): free for personal and non-commercial use with attribution ("Baobao Icons by @唐幡"); contact the author for commercial use.
