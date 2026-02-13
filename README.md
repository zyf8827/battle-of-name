# 姓名大作战 (Name Battle)

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-19.2-blue)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF)

**基于姓名哈希的确定性回合制自动战斗游戏**

[功能特性](#-核心特性) • [快速开始](#-快速开始) • [架构设计](#-架构设计) • [贡献指南](#-贡献指南)

</div>

---

## ✨ 核心特性

### 🎮 游戏机制
- **姓名即命运** - 相同的姓名永远生成相同的角色属性（基于 SHA-256 哈希算法）
- **完全确定性** - 相同的姓名 + 相同的种子 = 完全一致的战斗过程
- **回合制战斗** - 经典的 Round/Turn 战斗循环，支持技能、装备、Buff/Debuff 系统
- **随机事件** - 环境事件池系统，每回合可能触发意想不到的剧情

### 🏗️ 引擎架构
- **修饰器优先** - 所有游戏实体（装备、Buff、天赋、环境）统一为 `Modifier` 抽象
- **事件驱动** - 三阶段事件管道（拦截 → 结算 → 反应），支持深度优先递归处理
- **内容与引擎分离** - 通过 `BattleContentAdapter` 接口实现依赖倒置，内容可独立扩展
- **可扩展 DSL** - 80% 的游戏效果可通过声明式配置实现，无需编写代码

### 🛠️ 开发体验
- **完整测试覆盖** - 基于 Vitest 的单元测试和集成测试
- **平衡仿真工具** - 内置批量仿真脚本，验证战斗时长分布和平衡性
- **调试模式** - 浏览器控制台实时查看战斗引擎内部状态
- **类型安全** - 全面的 TypeScript 类型定义

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0（推荐）或 npm >= 9.0.0

### 安装

```bash
# 克隆仓库
git clone https://github.com/zyf8827/battle-of-name.git
cd battle-of-name

# 安装依赖
pnpm install
# 或
npm install
```

### 开发

```bash
# 启动开发服务器
pnpm dev
# 或
npm run dev
```

访问 http://localhost:5173 查看游戏

### 构建

```bash
# 生产构建
pnpm build
# 或
npm run build

# 预览构建结果
pnpm preview
# 或
npm run preview
```

### 运行测试

```bash
# 运行所有测试
pnpm test
# 或
npm run test

# 监听模式
pnpm test:watch
# 或
npm run test:watch
```

---

## 🎯 如何游玩

1. **输入对战双方姓名** - 任意中文或英文名字
2. **设置战斗种子** - 留空使用随机种子，或输入特定种子复现战斗
3. **点击"开始战斗"** - 观看自动战斗过程
4. **控制播放** - 支持暂停、单步执行、2倍速播放

### 战斗属性说明

| 属性 | 说明 | 影响 |
|------|------|------|
| **力量 (STR)** | 物理攻击力 | 物理伤害输出 |
| **敏捷 (AGI)** | 行动速度 | 回合内出手顺序 |
| **体质 (VIT)** | 身体强度 | 最大生命值 |
| **幸运 (LUK)** | 运气值 | 随机事件倾向、暴击率微调 |

---

## 🏗️ 架构设计

### 技术栈

- **前端框架**: React 19.2 + TypeScript 5.9
- **构建工具**: Vite 7.3
- **样式方案**: Tailwind CSS 3.4
- **状态管理**: Zustand 5.0
- **随机数生成**: seedrandom 3.0（确定性随机）
- **动画效果**: canvas-confetti 1.9
- **测试框架**: Vitest 4.0

### 核心设计原则

```
┌─────────────────────────────────────────────────────────────┐
│                      游戏引擎层                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ RNG      │  │ Event    │  │ Modifier │  │ Combat   │   │
│  │ (seeded)│──│ Pipeline │──│ System   │──│ Loop     │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    内容适配器接口                             │
│              (BattleContentAdapter)                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      内容层                                  │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐            │
│  │Class │ │Equip │ │Event │ │Consum│ │Buff  │            │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘            │
└─────────────────────────────────────────────────────────────┘
```

### 目录结构

```
src/
├── engine/              # 战斗引擎核心
│   ├── engine.ts        # 主战斗循环
│   ├── types.ts         # 核心类型定义
│   ├── rng.ts           # 种子随机数生成器
│   └── scheduler.ts     # 行动调度
│
├── content/            # 游戏内容（可独立扩展）
│   ├── classes/        # 职业定义
│   ├── equipment/      # 装备定义
│   ├── consumables/    # 消耗品定义
│   ├── events/         # 随机事件池
│   ├── modifiers/      # 可复用修饰器
│   └── narration.ts   # 战斗文本模板
│
├── ui/                # React 组件
├── store/             # Zustand 状态管理
└── main.tsx           # 应用入口
```

详细架构说明请参阅：
- [`docs/GAME_ENGINE.md`](docs/GAME_ENGINE.md) - 引擎技术规范
- [`docs/GAME_DESIGN.md`](docs/GAME_DESIGN.md) - 游戏设计文档
- [`docs/CONTENT_SPEC.md`](docs/CONTENT_SPEC.md) - 内容开发规范

---

## 🔧 开发指南

### 添加新内容

#### 添加新职业

创建 `src/content/classes/myClass.ts`:

```typescript
import type { CharacterClass } from '../base/characterClass';

const myClass: CharacterClass = {
  id: 'class.my_class',
  name: '新职业',
  description: '职业描述',
  baseStats: { STR: 10, AGI: 10, VIT: 10, LUK: 10 },
  talents: [/* 天赋修饰器数组 */],
};

export default myClass;
```

在 `src/content/classes/index.ts` 中注册：

```typescript
export const allClasses: CharacterClass[] = [
  // ...
  myClass,
];
```

#### 添加新装备

创建 `src/content/equipment/myEquipment.ts`:

```typescript
import type { EquipmentLike } from '../base/equipment';

const myEquipment: EquipmentLike = {
  id: 'equip.my_equipment',
  source: 'EQUIP',
  name: '新装备',
  slot: 'WEAPON',
  rarity: 'COMMON',
  statBonus: { STR: 5 },
  // 或使用 triggers + effects
};

export default myEquipment;
```

### 平衡性验证

添加新内容后，运行平衡仿真验证战斗时长：

```bash
npx tsx scripts/balance-sim.ts
```

目标指标：
- 平均回合数：11.5 ~ 13.0
- 快局占比（≤6回合）：< 2%
- 长局占比（>16回合）：< 15%

### 调试模式

在浏览器控制台启用详细日志：

```javascript
// 启用
window.__BATTLE_DEBUG__ = true

// 禁用
window.__BATTLE_DEBUG__ = false
```

启用后，控制台将显示：
- 事件处理流程
- 触发器命中/未命中原因
- 伤害/治疗计算详情
- 修饰器去重信息

---

## 🧪 测试

项目使用 Vitest 进行测试，配置文件为 `vitest.config.ts`。

### 测试覆盖范围

- ✅ 引擎核心逻辑（事件管道、修饰器系统）
- ✅ 随机数生成器确定性验证
- ✅ 内容适配器（姓名 → 属性映射）
- ✅ 修饰器验证和注册
- ✅ 文本模板渲染

### 运行测试

```bash
# 单次运行
pnpm test

# 监听模式（开发时推荐）
pnpm test:watch

# 查看覆盖率
pnpm test:coverage
```

---

## 📊 项目状态

当前版本：**v0.1.0**

### 已实现功能 ✅

- [x] 核心战斗引擎（完整 Round/Turn 循环）
- [x] 修饰器系统（优先级、持续时间、叠加策略）
- [x] 事件管道（三阶段处理、递归反应）
- [x] 确定性随机数生成（seed-based）
- [x] 姓名哈希生成角色属性
- [x] DSL 效果系统（吸血、减伤、护盾、驱散等）
- [x] 环境事件池系统
- [x] React UI（战斗日志、单位面板、结果页面）
- [x] 播放控制（暂停、单步、倍速）
- [x] 单元测试覆盖
- [x] 平衡仿真工具

### 规划中功能 🚧

- [ ] 更多职业和装备
- [ ] 战斗回放功能
- [ ] 成就系统

---

## 🤝 贡献指南

欢迎贡献！请遵循以下流程：

1. **Fork** 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 **Pull Request**

### 代码规范

- 遵循现有代码风格
- 所有新功能需要添加测试
- 更新相关文档（README、docs/）
- 运行 `pnpm test` 和 `pnpm build` 确保通过

### 提交信息规范

使用语义化提交信息：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整（不影响功能）
- `refactor:` 重构（不是新功能也不是修复）
- `test:` 添加测试
- `chore:` 构建过程或辅助工具变更

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 🙏 致谢

- [seedrandom](https://github.com/davidbau/seedrandom) - 确定性随机数生成
- [canvas-confetti](https://github.com/catdad/canvas-confetti) - 庆祝动画效果
- [Vite](https://vitejs.dev/) - 快速的前端构建工具
- [React](https://react.dev/) - UI 框架
- [Zustand](https://zustand-demo.pmnd.rs/) - 轻量级状态管理

---

## 📞 联系方式

- **作者**: zyf8827
- **仓库**: https://github.com/zyf8827/battle-of-name
- **问题反馈**: [GitHub Issues](https://github.com/zyf8827/battle-of-name/issues)

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐️ Star！**

Made with ❤️ by zyf8827

</div>
