import { getPageHtml } from "@/lib/page";

export default function ProductsPage() {
  return <div dangerouslySetInnerHTML={{ __html: getPageHtml("products") }} />;
}
