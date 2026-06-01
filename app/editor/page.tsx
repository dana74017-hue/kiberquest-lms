"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function EditorPage() {
  const [html, setHtml] = useState(`<h1 style="color: #22d3ee; text-align: center; margin-top: 50px;">
  Привет, KiberQuest!
</h1>
<p style="text-align: center; font-size: 1.2rem;">Это твой первый интерактивный урок</p>`);
  
  const [css, setCss] = useState(`body { background: linear-gradient(135deg, #0f172a, #1e2937); font-family: system-ui; }`);
  
  const [js, setJs] = useState(`console.log("Редактор работает! 🚀");`);
  
  const previewRef = useRef<HTMLIFrameElement>(null);

  const runCode = () => {
    const iframe = previewRef.current;
    if (!iframe) return;
    
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}<\/script>
        </body>
      </html>
    `);
    doc.close();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Живой Редактор Кода</h1>
          <Button onClick={runCode} size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-black px-10">
            ▶ Запустить код
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Редакторы */}
          <div className="space-y-6">
            {/* HTML */}
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-4">
                <div className="text-cyan-400 text-sm mb-2 font-medium">HTML</div>
                <textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="w-full h-64 bg-slate-950 text-cyan-300 font-mono p-4 rounded-xl outline-none resize-none"
                  spellCheck="false"
                />
              </CardContent>
            </Card>

            {/* CSS */}
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-4">
                <div className="text-pink-400 text-sm mb-2 font-medium">CSS</div>
                <textarea
                  value={css}
                  onChange={(e) => setCss(e.target.value)}
                  className="w-full h-64 bg-slate-950 text-pink-300 font-mono p-4 rounded-xl outline-none resize-none"
                  spellCheck="false"
                />
              </CardContent>
            </Card>

            {/* JS */}
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-4">
                <div className="text-yellow-400 text-sm mb-2 font-medium">JavaScript</div>
                <textarea
                  value={js}
                  onChange={(e) => setJs(e.target.value)}
                  className="w-full h-64 bg-slate-950 text-yellow-300 font-mono p-4 rounded-xl outline-none resize-none"
                  spellCheck="false"
                />
              </CardContent>
            </Card>
          </div>

          {/* Предпросмотр */}
          <Card className="bg-slate-900 border-slate-700 h-full">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="text-emerald-400 text-sm mb-3 font-medium flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                LIVE PREVIEW
              </div>
              <iframe
                ref={previewRef}
                className="flex-1 w-full bg-white rounded-2xl border border-slate-700"
                title="Preview"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}