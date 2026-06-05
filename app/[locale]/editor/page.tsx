"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Play } from "lucide-react";

export default function EditorPage() {
  const [html, setHtml] = useState(`<h1 style="color: #22d3ee; text-align: center; margin-top: 50px;">
  Привет, KiberQuest!
</h1>
<p style="text-align: center; font-size: 1.2rem;">Это твой первый интерактивный урок</p>`);
  
  const [css, setCss] = useState(`body { 
  background: linear-gradient(135deg, #0f172a, #1e2937); 
  font-family: system-ui; 
}`);
  
  const [js, setJs] = useState(`console.log("Редактор работает! 🚀");`);
  
  const [fileName, setFileName] = useState("my-project");
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
          <meta charset="UTF-8">
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

  // Сохранение как HTML файл
  const saveAsHtml = () => {
    const fullHtml = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
  <style>
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    ${js}
  <\/script>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold">Живой Редактор Кода</h1>
          
          <div className="flex flex-wrap gap-3">
            <Button onClick={runCode} size="lg" className="flex items-center gap-2">
              <Play size={20} />
              Запустить код
            </Button>
            
            <Button 
              onClick={saveAsHtml} 
              variant="outline" 
              size="lg" 
              className="flex items-center gap-2"
            >
              <Download size={20} />
              Сохранить как HTML
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Редакторы */}
          <div className="space-y-6">
            {/* HTML */}
            <Card>
              <CardContent className="p-4">
                <div className="text-primary text-sm mb-2 font-medium">HTML</div>
                <textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="w-full h-64 bg-muted text-foreground font-mono p-4 rounded-xl outline-none resize-none"
                  spellCheck="false"
                />
              </CardContent>
            </Card>

            {/* CSS */}
            <Card>
              <CardContent className="p-4">
                <div className="text-pink-400 text-sm mb-2 font-medium">CSS</div>
                <textarea
                  value={css}
                  onChange={(e) => setCss(e.target.value)}
                  className="w-full h-64 bg-muted text-foreground font-mono p-4 rounded-xl outline-none resize-none"
                  spellCheck="false"
                />
              </CardContent>
            </Card>

            {/* JavaScript */}
            <Card>
              <CardContent className="p-4">
                <div className="text-yellow-400 text-sm mb-2 font-medium">JavaScript</div>
                <textarea
                  value={js}
                  onChange={(e) => setJs(e.target.value)}
                  className="w-full h-64 bg-muted text-foreground font-mono p-4 rounded-xl outline-none resize-none"
                  spellCheck="false"
                />
              </CardContent>
            </Card>

            {/* Имя файла для сохранения */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Имя файла при сохранении:</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground"
                placeholder="my-project"
              />
            </div>
          </div>

          {/* Предпросмотр */}
          <Card className="h-full flex flex-col">
            <CardContent className="p-4 flex flex-col flex-1">
              <div className="text-emerald-400 text-sm mb-3 font-medium flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                LIVE PREVIEW
              </div>
              <iframe
                ref={previewRef}
                className="flex-1 w-full bg-white rounded-2xl border border-border"
                title="Preview"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}