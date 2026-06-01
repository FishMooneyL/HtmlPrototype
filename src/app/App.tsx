import { useMemo, useState } from "react";
import { Puck, Render, type Data } from "@puckeditor/core";
import { puckConfig, viewports } from "../builder/puckConfig";
import { initialPrototypeData } from "../data/pages/initialPrototypeData";
import {
  exportCssFile,
  exportHtmlDocument,
  exportNextPageCode,
} from "../utils/exportPrototypeCode";

type AppMode = "editor" | "preview" | "export";
type ExportMode = "html" | "css" | "next";

const storageKey = "htmlPrototypeBuilder.puckData";

const cloneInitialData = () => structuredClone(initialPrototypeData) as Data;

const loadStoredData = (): Data => {
  const rawValue = window.localStorage.getItem(storageKey);

  if (!rawValue) {
    return cloneInitialData();
  }

  try {
    return JSON.parse(rawValue) as Data;
  } catch {
    return cloneInitialData();
  }
};

const downloadTextFile = (fileName: string, text: string) => {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

export function App() {
  const [data, setData] = useState<Data>(() => loadStoredData());
  const [appMode, setAppMode] = useState<AppMode>("editor");
  const [exportMode, setExportMode] = useState<ExportMode>("html");

  const htmlCode = useMemo(() => exportHtmlDocument(data), [data]);
  const cssCode = useMemo(() => exportCssFile(), []);
  const nextCode = useMemo(() => exportNextPageCode(data), [data]);

  const activeCode =
    exportMode === "html" ? htmlCode : exportMode === "css" ? cssCode : nextCode;

  const saveData = (nextData: Data) => {
    window.localStorage.setItem(storageKey, JSON.stringify(nextData));
  };

  const resetData = () => {
    const nextData = cloneInitialData();
    setData(nextData);
    saveData(nextData);
  };

  return (
    <div className="builder-app">
      <header className="builder-topbar">
        <div>
          <strong>HtmlPrototype Builder</strong>
          <span>React + Puck 可拖拽原型编辑器 MVP</span>
        </div>
        <nav className="builder-tabs" aria-label="主功能">
          <button
            className={appMode === "editor" ? "is-active" : ""}
            onClick={() => setAppMode("editor")}
            type="button"
          >
            编辑器
          </button>
          <button
            className={appMode === "preview" ? "is-active" : ""}
            onClick={() => setAppMode("preview")}
            type="button"
          >
            预览
          </button>
          <button
            className={appMode === "export" ? "is-active" : ""}
            onClick={() => setAppMode("export")}
            type="button"
          >
            导出代码
          </button>
        </nav>
        <div className="builder-actions">
          <button onClick={() => saveData(data)} type="button">
            保存草稿
          </button>
          <button onClick={resetData} type="button">
            重置示例
          </button>
        </div>
      </header>

      {appMode === "editor" && (
        <main className="builder-editor">
          <Puck
            config={puckConfig}
            data={data}
            headerTitle="HtmlPrototype Builder"
            height="calc(100vh - 58px)"
            onChange={(nextData) => {
              setData(nextData);
              saveData(nextData);
            }}
            onPublish={(nextData) => {
              setData(nextData);
              saveData(nextData);
            }}
            viewports={viewports}
          />
        </main>
      )}

      {appMode === "preview" && (
        <main className="builder-preview">
          <section className="builder-preview-panel">
            <div className="builder-panel-head">
              <h2>实时渲染结果</h2>
              <p>这里使用同一份 Puck JSON 和组件库渲染，方便验证 PC / Mobile 样式。</p>
            </div>
            <Render config={puckConfig} data={data} />
          </section>
        </main>
      )}

      {appMode === "export" && (
        <main className="builder-export">
          <section className="builder-export-side">
            <h2>导出格式</h2>
            <button
              className={exportMode === "html" ? "is-active" : ""}
              onClick={() => setExportMode("html")}
              type="button"
            >
              HTML
            </button>
            <button
              className={exportMode === "css" ? "is-active" : ""}
              onClick={() => setExportMode("css")}
              type="button"
            >
              prototype.css
            </button>
            <button
              className={exportMode === "next" ? "is-active" : ""}
              onClick={() => setExportMode("next")}
              type="button"
            >
              Next.js page.tsx
            </button>
            <div className="builder-export-actions">
              <button
                onClick={() => navigator.clipboard.writeText(activeCode)}
                type="button"
              >
                复制当前代码
              </button>
              <button
                onClick={() =>
                  downloadTextFile(
                    exportMode === "html"
                      ? "prototype.html"
                      : exportMode === "css"
                        ? "prototype.css"
                        : "page.tsx",
                    activeCode,
                  )
                }
                type="button"
              >
                下载当前文件
              </button>
            </div>
          </section>
          <section className="builder-code-panel">
            <textarea readOnly spellCheck={false} value={activeCode} />
          </section>
        </main>
      )}
    </div>
  );
}
