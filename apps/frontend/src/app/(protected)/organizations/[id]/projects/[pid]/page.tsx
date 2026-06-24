import { ProjectApi } from "@/features/project/api/project.api";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await ProjectApi.get(params.id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{project.name}</h1>
      <p className="text-muted-foreground mt-2">
        {project.description || "No description"}
      </p>
    </div>
  );
}
