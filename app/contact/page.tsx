import { getPageHtml } from "@/lib/page";

export default function ContactPage() {
  return <div dangerouslySetInnerHTML={{ __html: getPageHtml("contact") }} />;
}
