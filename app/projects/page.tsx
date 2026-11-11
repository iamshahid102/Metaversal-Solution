import { getPageHtml } from "@/lib/page";

export default function ProjectsPage() {
  return <div dangerouslySetInnerHTML={{ __html: getPageHtml("projects") }} />;
}
