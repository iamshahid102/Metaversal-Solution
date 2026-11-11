import { getPageHtml } from "@/lib/page";

export default function ServicesPage() {
  return <div dangerouslySetInnerHTML={{ __html: getPageHtml("services") }} />;
}
