# HtmlPrototype

一个面向产品经理的可拖拉拽原型编辑器项目。目标是通过组件化、数据分离和统一样式规范，快速搭建高质量 HTML / React 原型页面，而不是继续维护巨型单文件原型。

## 当前状态

当前仓库还未正式搭建 React 应用，已有内容主要是：

```text
.
├── Agent.md              # 项目协作与 AI 生成代码规范
├── AGENTS.md             # 自动化 Agent 入口说明
├── README.md             # 项目说明
└── 项目原型/
    ├── C端web原型.html
    ├── C端移动端原型.html
    └── 管理后台原型 .html
```

`项目原型/` 是历史产品原型参考，建议只用于拆解页面、组件、PRD 和 mock 数据，不建议继续在这些 HTML 文件里追加新功能。

## 如何查看当前原型

方式一：直接用浏览器打开：

- `项目原型/C端web原型.html`
- `项目原型/C端移动端原型.html`
- `项目原型/管理后台原型 .html`

方式二：在项目根目录启动静态服务：

```bash
python3 -m http.server 5173
```

然后访问：

```text
http://localhost:5173/项目原型/C端web原型.html
http://localhost:5173/项目原型/C端移动端原型.html
http://localhost:5173/项目原型/管理后台原型%20.html
```

## 历史原型问题总结

已阅读 `项目原型/` 下三个 HTML 文件，当前主要问题是：

- 样式、mock 数据、页面 HTML、预览器逻辑和 PRD 注释混在同一个 HTML 文件中。
- 大量页面以 HTML 字符串形式存储，不利于维护和组件复用。
- CSS 大量写在内嵌 `<style>` 中，难以形成统一命名和设计令牌。
- 部分节点使用内联 `style=""`，后续主题切换和批量调整成本高。
- Mock 数据没有独立领域模型，后续 AI 生成页面容易重复造数据。

## 推荐后续技术方案

推荐优先使用自研 React 原型编辑器方案：

- React + TypeScript + Vite：项目基础框架。
- dnd-kit：拖拽、排序、嵌套容器、画布交互。
- CSS Modules 或集中 CSS：统一管理类名、设计令牌和组件样式。
- TypeScript Schema：定义页面树、组件清单、属性面板和 mock 数据。

参考官方资料：

- React 新项目建议：https://react.dev/learn/start-a-new-react-project
- Vite 快速开始：https://vite.dev/guide/
- dnd-kit 文档：https://docs.dndkit.com/
- GrapesJS 文档：https://grapesjs.com/docs/

如果希望最快得到完整网页搭建器，可以评估 GrapesJS；如果更看重导出代码质量、组件约束、mock 数据结构和 AI 生成规范，建议走 React + dnd-kit 自研路线。

## 建议的目标目录

正式搭建应用后，建议整理为：

```text
src/
  app/
  components/
    builder/
    prototype/
    ui/
  data/
    mock/
    pages/
  schemas/
  styles/
  utils/
```

关键职责：

- `components/builder/`：拖拽编辑器本身，如画布、组件面板、图层树、属性面板。
- `components/prototype/`：可被拖拽和导出的原型组件。
- `data/mock/`：领域 mock 数据，变量使用 camelCase。
- `schemas/`：页面节点、组件 manifest、属性配置的类型定义。
- `styles/`：设计令牌、基础样式、工具类和组件类名。
- `utils/exportHtml.ts`：页面树到 HTML / React 骨架的导出逻辑。

## 代码规范重点

详见 `Agent.md`。核心原则：

1. 结构、样式、数据必须分离。
2. CSS 类名集中管理，不在页面中散落内嵌样式。
3. Mock 数据抽离为对象或数组，并使用 camelCase。
4. 页面由组件树生成，不再维护超长 HTML 字符串。
5. AI 生成代码必须优先复用既有组件、样式 token 和 mock 数据。

## 建议下一步

1. 用 Vite 初始化 React + TypeScript 应用。
2. 把 `项目原型/` 的页面清单、PRD 注释和 mock 数据抽离成结构化 JSON / TS 文件。
3. 建立第一批原型组件：页面壳、卡片、按钮、表格、表单、空态、弹窗。
4. 接入 dnd-kit，实现组件面板拖到画布。
5. 实现页面树保存、导入导出和代码生成。
