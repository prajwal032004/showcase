import { renderOg, ogSize, ogContentType } from "@/lib/og";
import { getProject, projects } from "@/lib/projects";

export async function generateImageMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const { slug } = await params;
  const p = getProject(slug) ?? projects[0];
  return [
    {
      id: "card",
      size: ogSize,
      contentType: ogContentType,
      alt: `${p.title} — ${p.type}${p.concept ? " concept" : ""} by Forma Studio`,
    },
  ];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug) ?? projects[0];
  const words = p.title.split(" ");
  const title = words.length > 2 ? [words.slice(0, 2).join(" "), words.slice(2).join(" ")] : [p.title];
  return renderOg({
    eyebrow: `${p.concept ? "Concept" : "Live project"} · ${p.industry}`,
    title: [...title, p.type + "."],
    accent: title.length,
    subtitle: p.summary,
    variant: "project",
    project: p,
    dark: !p.concept,
  });
}
