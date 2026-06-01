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
const stylePropKeys = new Set([
  "backgroundColor",
  "textColor",
  "borderColor",
  "widthMode",
  "widthValue",
  "maxWidth",
  "padding",
  "marginTop",
  "borderRadius",
  "layoutMode",
  "flexDirection",
  "justifyContent",
  "alignItems",
  "gap",
  "fontSize",
  "fontWeight",
  "textAlign",
]);

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

const toCssValue = (propertyName: string, value: unknown) => {
  if (typeof value === "number") {
    return `${value}px`;
  }

  if (propertyName === "fontWeight") {
    return String(value);
  }

  return String(value);
};

const getDesignSurfaceStyle = (props: Record<string, unknown>) => {
  const styleEntries: string[] = [];
  const widthMode = props.widthMode;

  if (props.backgroundColor) {
    styleEntries.push(`background-color: ${props.backgroundColor}`);
  }

  if (props.textColor) {
    styleEntries.push(`color: ${props.textColor}`);
  }

  if (props.borderColor) {
    styleEntries.push(`border-color: ${props.borderColor}`);
  }

  if (widthMode === "full") {
    styleEntries.push("width: 100%");
  }

  if (widthMode === "fixed" && props.widthValue) {
    styleEntries.push(`width: ${toCssValue("widthValue", props.widthValue)}`);
  }

  if (widthMode === "hug") {
    styleEntries.push("width: fit-content");
  }

  if (props.maxWidth && Number(props.maxWidth) > 0) {
    styleEntries.push(`max-width: ${toCssValue("maxWidth", props.maxWidth)}`);
  }

  if (props.padding && Number(props.padding) > 0) {
    styleEntries.push(`padding: ${toCssValue("padding", props.padding)}`);
  }

  if (props.marginTop && Number(props.marginTop) > 0) {
    styleEntries.push(`margin-top: ${toCssValue("marginTop", props.marginTop)}`);
  }

  if (props.borderRadius && Number(props.borderRadius) > 0) {
    styleEntries.push(
      `border-radius: ${toCssValue("borderRadius", props.borderRadius)}`,
    );
  }

  if (props.fontSize && Number(props.fontSize) > 0) {
    styleEntries.push(`font-size: ${toCssValue("fontSize", props.fontSize)}`);
  }

  if (props.fontWeight && props.fontWeight !== "400") {
    styleEntries.push(`font-weight: ${props.fontWeight}`);
  }

  if (props.textAlign && props.textAlign !== "left") {
    styleEntries.push(`text-align: ${props.textAlign}`);
  }

  if (props.layoutMode === "flex") {
    styleEntries.push("display: flex");
    styleEntries.push(`flex-direction: ${props.flexDirection || "column"}`);
    styleEntries.push(`justify-content: ${props.justifyContent || "flex-start"}`);
    styleEntries.push(`align-items: ${props.alignItems || "stretch"}`);
    styleEntries.push(`gap: ${toCssValue("gap", props.gap || 16)}`);
  }

  if (props.layoutMode === "grid") {
    styleEntries.push("display: grid");
    styleEntries.push(`gap: ${toCssValue("gap", props.gap || 16)}`);
  }

  return styleEntries.length ? ` style="${escapeHtml(styleEntries.join("; "))}"` : "";
};

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

    case "DesignFrame":
      return `<section class="proto-design-frame" data-layer-name="${escapeHtml(
        props.name,
      )}"${getDesignSurfaceStyle(props)}>
  <div class="proto-slot proto-design-frame-slot">
${getSlot(node, "content")}
  </div>
</section>`;

    case "TextLayer": {
      const tagName = ["p", "h2", "h3", "span"].includes(String(props.tagName))
        ? String(props.tagName)
        : "p";

      return `<${tagName} class="proto-text-layer"${getDesignSurfaceStyle(props)}>${escapeHtml(
        props.text,
      )}</${tagName}>`;
    }

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
      const childHtml = slotKeys
        .filter((slotName) => !stylePropKeys.has(slotName))
        .map((slotName) => getSlot(node, slotName))
        .join("\n");
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
