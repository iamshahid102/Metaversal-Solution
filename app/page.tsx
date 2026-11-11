import { getPageHtml } from "@/lib/page";

export default function HomePage() {
  return <div dangerouslySetInnerHTML={{ __html: getPageHtml("home") }} />;
}
