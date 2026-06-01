# Agent.md

## 项目目标

本项目用于建设一套“可拖拉拽的定制化 HTML 原型生成器”，让产品经理可以通过组件面板、画布、图层树和属性面板快速搭建原型页面，并能导出结构清晰、样式规范、数据分离的 HTML / React 页面骨架。

当前 `项目原型/` 目录中的 HTML 是历史原型参考，不作为未来继续堆叠代码的目标形态。

## 推荐技术路线

优先采用：

- React + TypeScript + Vite：用于搭建可维护的单页原型编辑器。
- dnd-kit：用于组件拖拽、画布排序、嵌套容器拖放。
- CSS Modules / 全局设计令牌 CSS：用于样式集中管理。
- JSON Schema / TypeScript 类型：用于描述可拖拽组件、页面树、组件属性和 mock 数据。

如果目标是快速获得完整“网页搭建器”能力，可评估 GrapesJS；如果目标是完全控制组件、导出结构和代码规范，优先自研 React 组件编辑器。

## 核心产物要求

每个原型页面最终应能沉淀为：

1. 页面结构：由组件树或 React 组件组合生成，不允许手写大段不可维护 HTML 字符串。
2. 样式体系：集中放在 `src/styles/` 或组件样式文件中，不允许在 HTML 中散落大量 `<style>` 和 `style=""`。
3. Mock 数据：集中放在 `src/data/mock/`，变量使用 camelCase，数据对象必须有明确类型。
4. 页面配置：页面元信息、路由、画布节点、组件属性和 PRD 注释分离存放。
5. 导出能力：导出的 HTML / React 代码必须保留清晰层级、语义化标签和规范类名。

## 建议目录结构

未来搭建 React 项目时，建议使用如下结构：

```text
src/
  app/
    App.tsx
    routes.tsx
  components/
    builder/
      Canvas/
      ComponentPalette/
      InspectorPanel/
      LayerTree/
      Toolbar/
    prototype/
      PageShell/
      Card/
      Button/
      Form/
      Table/
      EmptyState/
      Modal/
    ui/
  data/
    mock/
      userMockData.ts
      journeyMockData.ts
      adminMockData.ts
    pages/
      prototypePages.ts
  schemas/
    prototypeNodeSchema.ts
    componentManifest.ts
  styles/
    tokens.css
    base.css
    utilities.css
    components.css
  utils/
    exportHtml.ts
    treeTransform.ts
```

## 命名规范

### 文件命名

- React 组件目录和组件文件使用 PascalCase：`ComponentPalette.tsx`。
- 工具函数、mock 数据、schema 文件使用 camelCase：`prototypeNodeSchema.ts`。
- 样式文件按职责命名：`tokens.css`、`components.css`、`utilities.css`。

### 变量命名

- JavaScript / TypeScript 变量统一使用 camelCase。
- 组件类型使用 PascalCase。
- 常量可使用 camelCase；只有真正全局不可变配置才允许使用 SCREAMING_SNAKE_CASE。

示例：

```ts
const prototypePages = [
  {
    pageId: "home-feed",
    pageName: "首页信息流",
    moduleName: "C端Web",
  },
];
```

### CSS 类名

CSS 类名必须可读、可复用、可搜索。推荐：

- 业务组件前缀：`proto-`
- 构建器前缀：`builder-`
- 工具类前缀：`u-`
- 状态类前缀：`is-` / `has-`

示例：

```css
.builder-canvas {}
.builder-layer-tree {}
.proto-page-shell {}
.proto-card {}
.u-text-muted {}
.is-selected {}
```

## 样式规则

1. 禁止在页面中新增大段内嵌 `<style>`。
2. 禁止为静态样式新增散落的 `style=""`。
3. 动态尺寸、主题色、坐标等可通过 CSS 变量承载，例如：

```tsx
<section className="builder-node" style={{ "--node-width": `${width}px` } as React.CSSProperties} />
```

4. 颜色、间距、字号、圆角、阴影必须优先引用 `tokens.css` 中的设计令牌。
5. 原型页面样式和编辑器自身样式分层管理，不允许互相污染。

## Mock 数据规则

1. Mock 数据必须从组件中抽离。
2. 每个 mock 文件只维护一个清晰领域，例如用户、旅程、帖子、后台审核。
3. 字段使用 camelCase，不使用中文 key。
4. 复杂数据需要定义 TypeScript 类型或接口。
5. 不在 JSX / HTML 字符串中硬编码大量业务列表。

示例：

```ts
export interface PrototypeUser {
  userId: string;
  displayName: string;
  handle: string;
  isVerified: boolean;
}

export const userMockData: PrototypeUser[] = [
  {
    userId: "user-001",
    displayName: "Jamie",
    handle: "jamie_pkr",
    isVerified: true,
  },
];
```

## 拖拽编辑器设计原则

编辑器至少包含：

- 组件面板：展示可拖拽组件和模板区块。
- 画布区域：承载页面结构，支持拖拽添加、排序、嵌套和选中。
- 图层树：展示页面节点层级，支持重命名、隐藏、复制、删除。
- 属性面板：编辑选中节点的 props、数据源、样式 token 和交互配置。
- 页面管理：支持新建页面、复制页面、分组、搜索和 PRD 注释。
- 导入导出：支持导出页面 JSON、HTML 骨架、React 组件骨架。

页面树建议使用统一 schema：

```ts
export interface PrototypeNode {
  nodeId: string;
  nodeType: string;
  displayName: string;
  props: Record<string, unknown>;
  styleRefs: string[];
  dataBinding?: string;
  children?: PrototypeNode[];
}
```

## AI 生成代码约束

当使用 AI 新增页面、组件或区块时，必须遵守：

1. 先复用已有组件和样式 token，再考虑新增组件。
2. 新增组件必须同时补充类型、mock 数据、样式和最小示例。
3. 不允许把完整页面塞进一个超长 HTML 字符串。
4. 不允许把 mock 数据直接写在 JSX 文本里。
5. 不允许为了视觉效果复制粘贴大量近似 CSS。
6. 输出页面必须有清晰层级：layout -> section -> component -> element。
7. 修改历史原型文件前必须说明原因；默认只把 `项目原型/` 当参考资料。

## 历史原型阅读结论

当前 `项目原型/` 包含：

- `C端web原型.html`
- `C端移动端原型.html`
- `管理后台原型 .html`

这些文件已经覆盖 C 端 Web、移动端和管理后台页面，但存在以下问题：

- 单文件体积较大，样式、数据、页面 HTML、PRD 注释和预览逻辑混在一起。
- 大量 CSS 以内嵌 `<style>` 形式重复出现。
- 页面内容以序列化 HTML 字符串保存，不利于组件复用、代码审查和二次生成。
- 部分样式仍使用内联 `style=""`，后续很难统一主题和规范类名。

后续开发应从这些文件中提取页面清单、组件清单、PRD 信息和 mock 数据，而不是继续维护同类巨型 HTML。

## 提交前检查

提交代码前至少检查：

- `git status --short`
- 新增页面是否遵守数据、样式、结构分离。
- 是否误提交 `.idea/`、`node_modules/`、`dist/` 等本地或构建产物。
- README 是否同步更新了启动方式、目录结构或关键决策。
