import type { Data } from "@puckeditor/core";
import prototypeCss from "../styles/prototype.css?raw";

type RawNode = {
  type: string;
  props: Record<string, unknown> & {
    id?: string;
  };
};

type RawMetric = {
  metricId?: string;
  metricLabel?: string;
  metricValue?: string;
  metricChange?: string;
};

const slotKeys = ["content", "left", "right"];

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const asNodes = (value: unknown): RawNode[] =>
  Array.isArray(value) ? (value as RawNode[]) : [];

const getSlot = (node: RawNode, slotName: string) => renderNodes(asNodes(node.props[slotName]));

const getAccentClass = (value: unknown) => `proto-accent-${value || "neutral"}`;

const getModeClass = (value: unknown) =>
  value === "wireframe" ? "is-wireframe" : "is-visual";

const renderNodes = (nodes: RawNode[]) => nodes.map(renderNode).join("\n");

const renderNode = (node: RawNode): string => {
  const props = node.props ?? {};

  switch (node.type) {
    case "PageShell": {
      const isMobile = props.surface === "mobile";
      const sideLeft = isMobile
        ? ""
        : `<aside class="proto-side-left"><div class="proto-logo">P</div><nav class="proto-nav"><span class="is-active">首页</span><span>旅程</span><span>通知</span><span>收藏</span></nav></aside>`;
      const sideRight = isMobile
        ? ""
        : `<aside class="proto-side-right"><div class="proto-search">搜索 玩家 / 旅程 / Posts</div><div class="proto-widget"><b>推荐关注</b><span>@jamie_pkr</span><span>@river_nick</span><span>@deep_run</span></div></aside>`;
      const mobileTabbar = isMobile
        ? `<nav class="proto-mobile-tabbar"><span class="is-active">首页</span><span>旅程</span><span>发布</span><span>我的</span></nav>`
        : "";

      return `<div class="proto-page-shell proto-page-shell--${isMobile ? "mobile" : "web"}">
  ${sideLeft}
  <main class="proto-shell-main">
    <header class="proto-shell-header">
      <div>
        <h1>${escapeHtml(props.pageTitle)}</h1>
        <p>${escapeHtml(props.pageSubtitle)}</p>
      </div>
      <button class="proto-icon-button">+</button>
    </header>
    <div class="proto-slot proto-shell-slot">
${getSlot(node, "content")}
    </div>
  </main>
  ${sideRight}
  ${mobileTabbar}
</div>`;
    }

    case "SectionBlock":
      return `<section class="proto-section proto-bg-${escapeHtml(
        props.backgroundTone,
      )} proto-section--${escapeHtml(props.layoutVariant)} ${getModeClass(
        props.prototypeMode,
      )}">
  <div class="proto-section-head">
    <h2>${escapeHtml(props.title)}</h2>
    <p>${escapeHtml(props.intro)}</p>
  </div>
  <div class="proto-slot proto-section-content proto-section-content--${escapeHtml(
    props.layoutVariant,
  )}">
${getSlot(node, "content")}
  </div>
</section>`;

    case "TwoColumnLayout":
      return `<div class="proto-two-col proto-two-col--${escapeHtml(
        props.ratio,
      )} proto-gap-${escapeHtml(props.gapSize)}">
  <div class="proto-slot proto-two-col-pane">
${getSlot(node, "left")}
  </div>
  <div class="proto-slot proto-two-col-pane">
${getSlot(node, "right")}
  </div>
</div>`;

    case "HeroBlock":
      return `<section class="proto-hero ${getAccentClass(props.accentColor)} ${getModeClass(
        props.prototypeMode,
      )}">
  <p class="proto-eyebrow">${escapeHtml(props.eyebrow)}</p>
  <h2>${escapeHtml(props.title)}</h2>
  <p>${escapeHtml(props.description)}</p>
  <div class="proto-actions">
    <button class="proto-button proto-button-primary">${escapeHtml(props.primaryText)}</button>
    <button class="proto-button proto-button-secondary">${escapeHtml(props.secondaryText)}</button>
  </div>
</section>`;

    case "FeedPost":
      return `<article class="proto-post-card ${getAccentClass(
        props.accentColor,
      )} ${getModeClass(props.prototypeMode)}">
  <div class="proto-avatar">${escapeHtml(String(props.authorName ?? "").slice(0, 1))}</div>
  <div class="proto-post-body">
    <div class="proto-post-meta"><b>${escapeHtml(props.authorName)}</b><span>@${escapeHtml(
        props.handle,
      )}</span><em>${escapeHtml(props.badgeText)}</em></div>
    <p>${escapeHtml(props.contentText)}</p>
    <div class="proto-hand-summary">${escapeHtml(props.handSummary)}</div>
    <div class="proto-post-stats">${escapeHtml(props.statsText)}</div>
  </div>
</article>`;

    case "MetricGrid": {
      const metrics = Array.isArray(props.metrics) ? (props.metrics as RawMetric[]) : [];
      const metricHtml = metrics
        .map(
          (metric) => `<div class="proto-metric-item">
  <span>${escapeHtml(metric.metricLabel)}</span>
  <b>${escapeHtml(metric.metricValue)}</b>
  <em>${escapeHtml(metric.metricChange)}</em>
</div>`,
        )
        .join("\n");

      return `<section class="proto-metric-card ${getAccentClass(
        props.accentColor,
      )} ${getModeClass(props.prototypeMode)}">
  <h3>${escapeHtml(props.title)}</h3>
  <div class="proto-metric-grid">
${metricHtml}
  </div>
</section>`;
    }

    case "ActionButton":
      return `<button class="proto-button proto-button-${escapeHtml(
        props.variant,
      )} ${getAccentClass(props.accentColor)}">${escapeHtml(props.label)}</button>`;

    case "EmptyState":
      return `<section class="proto-empty-state ${getAccentClass(
        props.accentColor,
      )} ${getModeClass(props.prototypeMode)}">
  <div class="proto-empty-icon"></div>
  <h3>${escapeHtml(props.title)}</h3>
  <p>${escapeHtml(props.description)}</p>
  <button class="proto-button proto-button-secondary">${escapeHtml(props.actionText)}</button>
</section>`;

    case "FormBlock":
      return `<form class="proto-form-card ${getModeClass(props.prototypeMode)}">
  <h3>${escapeHtml(props.title)}</h3>
  <label><span>${escapeHtml(props.firstFieldLabel)}</span><input placeholder="请输入" /></label>
  <label><span>${escapeHtml(props.secondFieldLabel)}</span><input placeholder="请选择" /></label>
  <button class="proto-button proto-button-primary" type="button">${escapeHtml(
    props.submitText,
  )}</button>
</form>`;

    case "ImagePlaceholder":
      return `<div class="proto-image-placeholder proto-image-placeholder--${escapeHtml(
        props.aspectRatio,
      )}"><span>${escapeHtml(props.title)}</span></div>`;

    default: {
      const childHtml = slotKeys.map((slotName) => getSlot(node, slotName)).join("\n");
      return `<div class="proto-unknown-node" data-node-type="${escapeHtml(
        node.type,
      )}">${childHtml}</div>`;
    }
  }
};

export const exportCssFile = () => prototypeCss;

export const exportHtmlDocument = (data: Data) => `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(data.root?.props?.title ?? "Prototype")}</title>
    <link rel="stylesheet" href="./prototype.css" />
  </head>
  <body>
    <div class="proto-root">
${renderNodes(asNodes(data.content))}
    </div>
  </body>
</html>
`;

export const exportNextPageCode = (data: Data) => `import "./prototype.css";

export default function PrototypePage() {
  return (
    <div
      className="proto-root"
      dangerouslySetInnerHTML={{ __html: ${JSON.stringify(renderNodes(asNodes(data.content)))} }}
    />
  );
}
`;
