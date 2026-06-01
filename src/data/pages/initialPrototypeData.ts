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
                  type: "DesignFrame",
                  props: {
                    id: "figma-like-frame",
                    name: "可视化样式 Frame",
                    backgroundColor: "#ffffff",
                    textColor: "#111111",
                    borderColor: "#d4d4d4",
                    widthMode: "full",
                    widthValue: 640,
                    maxWidth: 0,
                    padding: 20,
                    marginTop: 0,
                    borderRadius: 20,
                    layoutMode: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "stretch",
                    gap: 12,
                    fontSize: 0,
                    fontWeight: "400",
                    textAlign: "left",
                    content: [
                      {
                        type: "TextLayer",
                        props: {
                          id: "figma-like-text",
                          text: "这个 Frame 可以在右侧属性区调背景色、字体颜色、Flex/Grid、间距、宽度、圆角等。",
                          tagName: "p",
                          backgroundColor: "",
                          textColor: "#2563eb",
                          borderColor: "",
                          widthMode: "auto",
                          widthValue: 640,
                          maxWidth: 0,
                          padding: 0,
                          marginTop: 0,
                          borderRadius: 0,
                          layoutMode: "block",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          alignItems: "stretch",
                          gap: 16,
                          fontSize: 15,
                          fontWeight: "600",
                          textAlign: "left",
                        },
                      },
                    ],
                  },
                },
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
