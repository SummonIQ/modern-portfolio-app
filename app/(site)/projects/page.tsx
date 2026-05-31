import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/marketing/section";
import { ProjectCard } from "@/components/marketing/project-card";
import { ProjectFilter } from "@/components/marketing/project-filter";
import { getPublishedProjects } from "@/lib/portfolio";

export const revalidate = 60;
export const metadata: Metadata = { title: "Work" };

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();
  const categories = Array.from(
    new Set(projects.map((p) => p.category)),
  ).sort();

  return (
    <Section className="pt-16">
      <SectionHeading
        eyebrow="Portfolio"
        title="Selected work"
        subtitle="A collection of recent projects, side experiments, and client work."
      />
      <ProjectFilter
        projects={projects.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          summary: p.summary,
          category: p.category,
          date: p.date,
          coverImage: p.coverImage,
          tags: p.tags,
          featured: p.featured,
        }))}
        categories={categories}
      />
    </Section>
  );
}
