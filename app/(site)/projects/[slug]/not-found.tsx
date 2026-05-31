import Link from "next/link";
import { Section } from "@/components/marketing/section";

export default function ProjectNotFound() {
  return (
    <Section className="text-center py-32">
      <h1 className="font-display text-5xl font-semibold tracking-tight">
        Project not found
      </h1>
      <p className="mt-3 text-muted-foreground">
        The project you&apos;re looking for doesn&apos;t exist or was moved.
      </p>
      <Link
        href="/projects"
        className="mt-6 inline-flex text-sm font-medium text-foreground underline-offset-4 hover:underline"
      >
        ← Back to all work
      </Link>
    </Section>
  );
}
