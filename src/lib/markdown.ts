import { marked } from "marked";

marked.setOptions({ breaks: true, gfm: true });

export function renderMarkdown(content: string): string {
  const html = marked.parse(content, { async: false }) as string;
  return html;
}
