## 贪食蛇小游戏

使用html5 canvas绘制成

### 安装 (前提是安装了Node)

```bash
npm install
```

### 运行

* 开发模式

```bash
npm run dev
```

* 打包

```bash
npm run build
```

### 操作指南

操作很简单，使用键盘的 `上、下、左、右` 控制蛇行走的方向，基本游戏规则与我们平常玩的贪食蛇一样

### 文件介绍
- `index.html`: 主要的显示载体
- `canvas.js`: 绘制动画与游戏
- `canvas.ts`: 用`ts`将js文件改写了下
- `Snake.js`: 从`canvas.js`中单独抽出来的类`Snake`
- `./tsc/canvas.js`: 用`tsc`命令编译成的基于`es5`的`js`文件
