import { remark } from "remark";
import html from "remark-html";

async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export async function BlogContent({ content }: { content: string }) {
  const htmlContent = await markdownToHtml(content);

  return (
    <div
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
