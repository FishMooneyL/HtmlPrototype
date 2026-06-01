import type { Config, Viewports } from "@puckeditor/core";
import type { ReactNode } from "react";
import { feedPostMockData } from "../data/mock/feedPostMockData";
import type { MetricMockItem } from "../data/mock/metricMockData";

type AccentColor = "neutral" | "blue" | "green" | "purple";
type PrototypeMode = "visual" | "wireframe";

const accentOptions = [
  { label: "黑白灰", value: "neutral" },
  { label: "蓝色", value: "blue" },
  { label: "绿色", value: "green" },
  { label: "紫色", value: "purple" },
];

const prototypeModeOptions = [
  { label: "高保真", value: "visual" },
  { label: "线框原型", value: "wireframe" },
];

const getAccentClass = (accentColor?: AccentColor) =>
  `proto-accent-${accentColor ?? "neutral"}`;

const getModeClass = (prototypeMode?: PrototypeMode) =>
  prototypeMode === "wireframe" ? "is-wireframe" : "is-visual";

const slotAllowList = [
  "HeroBlock",
  "SectionBlock",
  "TwoColumnLayout",
  "FeedPost",
  "MetricGrid",
  "ActionButton",
  "EmptyState",
  "FormBlock",
  "ImagePlaceholder",
];

export const viewports: Viewports = [
  {
    width: "100%",
    height: "auto",
    label: "PC",
    icon: "Monitor",
  },
  {
    width: 390,
    height: "auto",
    label: "Mobile",
    icon: "Smartphone",
  },
];

export const puckConfig = {
  categories: {
    layout: {
      title: "布局组件",
      components: ["PageShell", "SectionBlock", "TwoColumnLayout"],
      defaultExpanded: true,
    },
    content: {
      title: "内容组件",
      components: ["HeroBlock", "FeedPost", "MetricGrid", "ImagePlaceholder"],
      defaultExpanded: true,
    },
    feedback: {
      title: "表单与状态",
      components: ["ActionButton", "EmptyState", "FormBlock"],
      defaultExpanded: true,
    },
  },
  root: {
    fields: {
      title: {
        type: "text",
        label: "页面标题",
      },
    },
    render: ({ children }: { children: ReactNode }) => (
      <div className="proto-root">{children}</div>
    ),
  },
  components: {
    PageShell: {
      label: "页面壳：PC / Mobile",
      fields: {
        surface: {
          type: "select",
          label: "页面样式",
          options: [
            { label: "PC 三栏", value: "web" },
            { label: "移动端", value: "mobile" },
          ],
        },
        pageTitle: {
          type: "text",
          label: "页面标题",
        },
        pageSubtitle: {
          type: "textarea",
          label: "页面说明",
        },
        content: {
          type: "slot",
          label: "页面内容",
          allow: slotAllowList.filter((name) => name !== "PageShell"),
        },
      },
      defaultProps: {
        surface: "web",
        pageTitle: "新原型页面",
        pageSubtitle: "支持 PC / Mobile 预览和组件化导出。",
        content: [],
      },
      render: ({ surface, pageTitle, pageSubtitle, content: Content }) => {
        const isMobile = surface === "mobile";

        return (
          <div
            className={`proto-page-shell proto-page-shell--${
              isMobile ? "mobile" : "web"
            }`}
          >
            {!isMobile && (
              <aside className="proto-side-left">
                <div className="proto-logo">P</div>
                <nav className="proto-nav">
                  <span className="is-active">首页</span>
                  <span>旅程</span>
                  <span>通知</span>
                  <span>收藏</span>
                </nav>
              </aside>
            )}

            <main className="proto-shell-main">
              <header className="proto-shell-header">
                <div>
                  <h1>{pageTitle}</h1>
                  <p>{pageSubtitle}</p>
                </div>
                <button className="proto-icon-button">+</button>
              </header>
              {Content({
                className: "proto-slot proto-shell-slot",
                minEmptyHeight: 360,
              })}
            </main>

            {!isMobile && (
              <aside className="proto-side-right">
                <div className="proto-search">搜索 玩家 / 旅程 / Posts</div>
                <div className="proto-widget">
                  <b>推荐关注</b>
                  <span>@jamie_pkr</span>
                  <span>@river_nick</span>
                  <span>@deep_run</span>
                </div>
              </aside>
            )}

            {isMobile && (
              <nav className="proto-mobile-tabbar">
                <span className="is-active">首页</span>
                <span>旅程</span>
                <span>发布</span>
                <span>我的</span>
              </nav>
            )}
          </div>
        );
      },
    },
    SectionBlock: {
      label: "内容区：可嵌套",
      fields: {
        title: {
          type: "text",
          label: "标题",
        },
        intro: {
          type: "textarea",
          label: "说明",
        },
        backgroundTone: {
          type: "select",
          label: "背景",
          options: [
            { label: "白色", value: "plain" },
            { label: "浅灰", value: "soft" },
            { label: "描边", value: "outline" },
          ],
        },
        layoutVariant: {
          type: "select",
          label: "布局",
          options: [
            { label: "纵向", value: "stack" },
            { label: "网格", value: "grid" },
          ],
        },
        prototypeMode: {
          type: "radio",
          label: "是否原型",
          options: prototypeModeOptions,
        },
        content: {
          type: "slot",
          label: "嵌套内容",
          allow: slotAllowList.filter((name) => name !== "PageShell"),
        },
      },
      defaultProps: {
        title: "内容区",
        intro: "可拖入任意内容组件。",
        backgroundTone: "plain",
        layoutVariant: "stack",
        prototypeMode: "visual",
        content: [],
      },
      render: ({
        title,
        intro,
        backgroundTone,
        layoutVariant,
        prototypeMode,
        content: Content,
      }) => (
        <section
          className={`proto-section proto-bg-${backgroundTone} proto-section--${layoutVariant} ${getModeClass(
            prototypeMode,
          )}`}
        >
          <div className="proto-section-head">
            <h2>{title}</h2>
            <p>{intro}</p>
          </div>
          {Content({
            className: `proto-slot proto-section-content proto-section-content--${layoutVariant}`,
            minEmptyHeight: 160,
          })}
        </section>
      ),
    },
    TwoColumnLayout: {
      label: "双栏容器",
      fields: {
        ratio: {
          type: "select",
          label: "栏宽比例",
          options: [
            { label: "左右均分", value: "balanced" },
            { label: "左宽右窄", value: "leftWide" },
            { label: "左窄右宽", value: "rightWide" },
          ],
        },
        gapSize: {
          type: "select",
          label: "间距",
          options: [
            { label: "小", value: "small" },
            { label: "中", value: "medium" },
            { label: "大", value: "large" },
          ],
        },
        left: {
          type: "slot",
          label: "左侧内容",
          allow: slotAllowList.filter((name) => name !== "PageShell"),
        },
        right: {
          type: "slot",
          label: "右侧内容",
          allow: slotAllowList.filter((name) => name !== "PageShell"),
        },
      },
      defaultProps: {
        ratio: "balanced",
        gapSize: "medium",
        left: [],
        right: [],
      },
      render: ({ ratio, gapSize, left: Left, right: Right }) => (
        <div className={`proto-two-col proto-two-col--${ratio} proto-gap-${gapSize}`}>
          {Left({
            className: "proto-slot proto-two-col-pane",
            minEmptyHeight: 180,
          })}
          {Right({
            className: "proto-slot proto-two-col-pane",
            minEmptyHeight: 180,
          })}
        </div>
      ),
    },
    HeroBlock: {
      label: "Hero 首屏",
      fields: {
        eyebrow: {
          type: "text",
          label: "眉标题",
        },
        title: {
          type: "text",
          label: "主标题",
        },
        description: {
          type: "textarea",
          label: "描述",
        },
        primaryText: {
          type: "text",
          label: "主按钮",
        },
        secondaryText: {
          type: "text",
          label: "次按钮",
        },
        accentColor: {
          type: "select",
          label: "组件颜色",
          options: accentOptions,
        },
        prototypeMode: {
          type: "radio",
          label: "是否原型",
          options: prototypeModeOptions,
        },
      },
      defaultProps: {
        eyebrow: "Prototype",
        title: "页面主标题",
        description: "这是一段页面说明。",
        primaryText: "主操作",
        secondaryText: "次操作",
        accentColor: "neutral",
        prototypeMode: "visual",
      },
      render: ({
        eyebrow,
        title,
        description,
        primaryText,
        secondaryText,
        accentColor,
        prototypeMode,
      }) => (
        <section
          className={`proto-hero ${getAccentClass(accentColor)} ${getModeClass(
            prototypeMode,
          )}`}
        >
          <p className="proto-eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{description}</p>
          <div className="proto-actions">
            <button className="proto-button proto-button-primary">{primaryText}</button>
            <button className="proto-button proto-button-secondary">
              {secondaryText}
            </button>
          </div>
        </section>
      ),
    },
    FeedPost: {
      label: "Post 卡片",
      fields: {
        dataSource: {
          type: "select",
          label: "Mock 数据",
          options: [
            { label: "手动输入", value: "manual" },
            ...feedPostMockData.map((item) => ({
              label: `${item.authorName} / ${item.postId}`,
              value: item.postId,
            })),
          ],
        },
        authorName: {
          type: "text",
          label: "作者",
        },
        handle: {
          type: "text",
          label: "账号",
        },
        badgeText: {
          type: "text",
          label: "标签",
        },
        contentText: {
          type: "textarea",
          label: "正文",
        },
        handSummary: {
          type: "text",
          label: "牌局摘要",
        },
        statsText: {
          type: "text",
          label: "统计",
        },
        accentColor: {
          type: "select",
          label: "组件颜色",
          options: accentOptions,
        },
        prototypeMode: {
          type: "radio",
          label: "是否原型",
          options: prototypeModeOptions,
        },
      },
      defaultProps: {
        dataSource: "manual",
        authorName: "作者名",
        handle: "handle",
        badgeText: "认证",
        contentText: "Post 内容摘要。",
        handSummary: "BTN vs BB · NLH",
        statsText: "0 评论 · 0 收藏",
        accentColor: "neutral",
        prototypeMode: "visual",
      },
      render: ({
        dataSource,
        authorName,
        handle,
        badgeText,
        contentText,
        handSummary,
        statsText,
        accentColor,
        prototypeMode,
      }) => {
        const mockPost = feedPostMockData.find((item) => item.postId === dataSource);
        const post = mockPost ?? {
          authorName,
          handle,
          badgeText,
          contentText,
          handSummary,
          statsText,
        };

        return (
          <article
            className={`proto-post-card ${getAccentClass(accentColor)} ${getModeClass(
              prototypeMode,
            )}`}
          >
            <div className="proto-avatar">{post.authorName.slice(0, 1)}</div>
            <div className="proto-post-body">
              <div className="proto-post-meta">
                <b>{post.authorName}</b>
                <span>@{post.handle}</span>
                <em>{post.badgeText}</em>
              </div>
              <p>{post.contentText}</p>
              <div className="proto-hand-summary">{post.handSummary}</div>
              <div className="proto-post-stats">{post.statsText}</div>
            </div>
          </article>
        );
      },
    },
    MetricGrid: {
      label: "指标卡组",
      fields: {
        title: {
          type: "text",
          label: "标题",
        },
        metrics: {
          type: "array",
          label: "指标",
          min: 1,
          max: 6,
          getItemSummary: (item) => item.metricLabel || "指标",
          arrayFields: {
            metricId: {
              type: "text",
              label: "ID",
            },
            metricLabel: {
              type: "text",
              label: "名称",
            },
            metricValue: {
              type: "text",
              label: "数值",
            },
            metricChange: {
              type: "text",
              label: "变化",
            },
          },
        },
        accentColor: {
          type: "select",
          label: "组件颜色",
          options: accentOptions,
        },
        prototypeMode: {
          type: "radio",
          label: "是否原型",
          options: prototypeModeOptions,
        },
      },
      defaultProps: {
        title: "核心指标",
        metrics: [
          {
            metricId: "metric-a",
            metricLabel: "指标 A",
            metricValue: "1,024",
            metricChange: "+8%",
          },
          {
            metricId: "metric-b",
            metricLabel: "指标 B",
            metricValue: "256",
            metricChange: "-2%",
          },
        ],
        accentColor: "neutral",
        prototypeMode: "visual",
      },
      render: ({ title, metrics, accentColor, prototypeMode }) => (
        <section
          className={`proto-metric-card ${getAccentClass(accentColor)} ${getModeClass(
            prototypeMode,
          )}`}
        >
          <h3>{title}</h3>
          <div className="proto-metric-grid">
            {(metrics as MetricMockItem[]).map((metric) => (
              <div className="proto-metric-item" key={metric.metricId}>
                <span>{metric.metricLabel}</span>
                <b>{metric.metricValue}</b>
                <em>{metric.metricChange}</em>
              </div>
            ))}
          </div>
        </section>
      ),
    },
    ActionButton: {
      label: "按钮",
      fields: {
        label: {
          type: "text",
          label: "文案",
        },
        variant: {
          type: "select",
          label: "类型",
          options: [
            { label: "主按钮", value: "primary" },
            { label: "次按钮", value: "secondary" },
            { label: "文本按钮", value: "ghost" },
          ],
        },
        accentColor: {
          type: "select",
          label: "组件颜色",
          options: accentOptions,
        },
      },
      defaultProps: {
        label: "按钮",
        variant: "primary",
        accentColor: "neutral",
      },
      render: ({ label, variant, accentColor }) => (
        <button
          className={`proto-button proto-button-${variant} ${getAccentClass(
            accentColor,
          )}`}
        >
          {label}
        </button>
      ),
    },
    EmptyState: {
      label: "空状态",
      fields: {
        title: {
          type: "text",
          label: "标题",
        },
        description: {
          type: "textarea",
          label: "说明",
        },
        actionText: {
          type: "text",
          label: "按钮",
        },
        accentColor: {
          type: "select",
          label: "组件颜色",
          options: accentOptions,
        },
        prototypeMode: {
          type: "radio",
          label: "是否原型",
          options: prototypeModeOptions,
        },
      },
      defaultProps: {
        title: "暂无数据",
        description: "这里会展示空状态说明。",
        actionText: "刷新",
        accentColor: "neutral",
        prototypeMode: "wireframe",
      },
      render: ({ title, description, actionText, accentColor, prototypeMode }) => (
        <section
          className={`proto-empty-state ${getAccentClass(accentColor)} ${getModeClass(
            prototypeMode,
          )}`}
        >
          <div className="proto-empty-icon" />
          <h3>{title}</h3>
          <p>{description}</p>
          <button className="proto-button proto-button-secondary">{actionText}</button>
        </section>
      ),
    },
    FormBlock: {
      label: "表单卡片",
      fields: {
        title: {
          type: "text",
          label: "标题",
        },
        firstFieldLabel: {
          type: "text",
          label: "字段一",
        },
        secondFieldLabel: {
          type: "text",
          label: "字段二",
        },
        submitText: {
          type: "text",
          label: "提交按钮",
        },
        prototypeMode: {
          type: "radio",
          label: "是否原型",
          options: prototypeModeOptions,
        },
      },
      defaultProps: {
        title: "新建用户",
        firstFieldLabel: "邮箱",
        secondFieldLabel: "角色",
        submitText: "保存",
        prototypeMode: "visual",
      },
      render: ({
        title,
        firstFieldLabel,
        secondFieldLabel,
        submitText,
        prototypeMode,
      }) => (
        <form className={`proto-form-card ${getModeClass(prototypeMode)}`}>
          <h3>{title}</h3>
          <label>
            <span>{firstFieldLabel}</span>
            <input placeholder="请输入" />
          </label>
          <label>
            <span>{secondFieldLabel}</span>
            <input placeholder="请选择" />
          </label>
          <button className="proto-button proto-button-primary" type="button">
            {submitText}
          </button>
        </form>
      ),
    },
    ImagePlaceholder: {
      label: "图片占位",
      fields: {
        title: {
          type: "text",
          label: "占位文案",
        },
        aspectRatio: {
          type: "select",
          label: "比例",
          options: [
            { label: "16:9", value: "wide" },
            { label: "4:3", value: "standard" },
            { label: "1:1", value: "square" },
          ],
        },
      },
      defaultProps: {
        title: "图片 / 视频占位",
        aspectRatio: "wide",
      },
      render: ({ title, aspectRatio }) => (
        <div className={`proto-image-placeholder proto-image-placeholder--${aspectRatio}`}>
          <span>{title}</span>
        </div>
      ),
    },
  },
} satisfies Config;
