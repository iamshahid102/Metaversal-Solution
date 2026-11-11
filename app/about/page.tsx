import { getPageHtml } from "@/lib/page";

export default function AboutPage() {
  return <div dangerouslySetInnerHTML={{ __html: getPageHtml("about") }} />;
}
