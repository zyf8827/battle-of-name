# 姓名大作战

基于 `MVP.md` 的最小可行版本实现：

- 输入两个姓名 + battle seed
- 生成确定性角色属性
- 运行完整回合制战斗循环（RoundStart / Turn / RoundEnd）
- 事件管道（Interception -> Resolution -> Reaction DFS）
- Modifier 系统（priority / appliedOrder / duration / stacking）
- 环境事件窗口（RoundStart / RoundEnd）
- 单页 UI（Start / Pause / Step / x2）
- 可复现战斗日志（同姓名 + 同 seed 一致）

## 运行

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
```

## 主要目录

- `src/engine`：引擎核心（RNG、主循环、事件管道、调度）
- `src/content`：职业、装备、道具、事件池、modifier DSL 内容
- `src/store`：Zustand 战斗状态
- `src/ui`：页面组件与日志展示

## 调试日志（Console）

引擎支持可开关的底层调试输出（事件处理、触发器命中、伤害/治疗结算、去重与跳过原因）。

在浏览器控制台执行：

```js
window.__BATTLE_DEBUG__ = true
```

关闭：

```js
window.__BATTLE_DEBUG__ = false
```

开启后可在 Console 中看到 `[battle-debug]` 前缀日志。
