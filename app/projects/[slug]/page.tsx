import { notFound } from "next/navigation";
import { getPageHtml } from "@/lib/page";

const PROJECTS: Record<string, string> = {
  "ai-fraud-detection": "project-ai-fraud-detection",
  zurbez: "project-zurbez",
  "aws-devops-pipeline": "project-aws-devops-pipeline",
  "nouvelle-spaces": "project-nouvelle-spaces",
  "fabric-data-infrastructure": "project-fabric-data-infrastructure",
  safar: "project-safar",
};

export function generateStaticParams() {
  return Object.keys(PROJECTS).map((slug) => ({ slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = PROJECTS[slug];
  if (!page) notFound();
  return <div dangerouslySetInnerHTML={{ __html: getPageHtml(page) }} />;
}
