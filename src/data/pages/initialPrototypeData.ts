import type { Data } from "@puckeditor/core";
import { metricMockData } from "../mock/metricMockData";

export const initialPrototypeData: Data = {
  root: {
    props: {
      title: "Pokerbirdy 原型页",
    },
  },
  content: [
    {
      type: "PageShell",
      props: {
        id: "page-shell-home",
        surface: "web",
        pageTitle: "Pokerbirdy 首页",
        pageSubtitle: "C 端 Web / 移动端统一组件化原型",
        content: [
          {
            type: "HeroBlock",
            props: {
              id: "hero-home",
              eyebrow: "Prototype Builder",
              title: "拖拽组件，快速搭出规范原型",
              description:
                "组件属性、颜色、原型模式、嵌套布局和 mock 数据全部结构化保存，后续可导出 HTML 或 Next.js 骨架。",
              primaryText: "发布一条 Post",
              secondaryText: "查看 Journey",
              accentColor: "neutral",
              prototypeMode: "visual",
            },
          },
          {
            type: "TwoColumnLayout",
            props: {
              id: "two-col-home",
              ratio: "balanced",
              gapSize: "medium",
              left: [
                {
                  type: "FeedPost",
                  props: {
                    id: "feed-post-demo",
                    dataSource: "post-001",
                    authorName: "Jamie",
                    handle: "jamie_pkr",
                    badgeText: "认证",
                    contentText: "这是一条可绑定 mock 数据的 Post 卡片。",
                    handSummary: "BTN vs BB · NLH 50/100",
                    statsText: "128 评论 · 36 收藏",
                    accentColor: "blue",
                    prototypeMode: "visual",
                  },
                },
              ],
              right: [
                {
                  type: "MetricGrid",
                  props: {
                    id: "metric-grid-demo",
                    title: "运营指标",
                    accentColor: "green",
                    prototypeMode: "visual",
                    metrics: metricMockData,
                  },
                },
              ],
            },
          },
          {
            type: "SectionBlock",
            props: {
              id: "section-nested",
              title: "可嵌套内容区",
              intro: "把卡片、按钮、空态、表单继续拖进这个容器里。",
              backgroundTone: "soft",
              layoutVariant: "grid",
              prototypeMode: "wireframe",
              content: [
                {
                  type: "EmptyState",
                  props: {
                    id: "empty-state-demo",
                    title: "暂无筛选结果",
                    description: "清空筛选条件后重新查看内容。",
                    actionText: "清空筛选",
                    accentColor: "purple",
                    prototypeMode: "wireframe",
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
