import { getAllProjectByOrganizationId } from "@/actions/projects.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import DeleteProject from "./DeleteProject";

interface Props {
  organizationId: string;
}

const ProjectList = async ({ organizationId }: Props) => {
  const { projects, organization } = await getAllProjectByOrganizationId(
    organizationId
  );

  if (!organization) {
    return (
      <div className="p-6 text-center text-gray-300">
        <h2 className="text-lg font-semibold text-red-400">
          Organization not found
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          We couldn't find an organization with ID{" "}
          <code className="bg-gray-800 px-1 py-0.5 rounded">
            {organizationId}
          </code>
          .
        </p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <p className="text-gray-300 text-base">
        No projects found.{" "}
        <Link
          href="/projects/create"
          className="text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors"
        >
          Create New
        </Link>
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="bg-gray-900 border border-gray-800 text-gray-100"
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex justify-between ">
              {project.name}
              <DeleteProject projectId={project.id} />
            </CardTitle>
            <p className="text-sm text-gray-400">
              Created on {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-gray-300 max-h-[4.5rem] max-w-[530px] line-clamp-2">
              {project.description || "No description provided."}
            </p>

            <div className="flex items-center gap-4">
              <Link
                href={`/projects/${project.id}`}
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              >
                View Project
              </Link>
              <Link
                href={`/organization/${organization.slug}`}
                className="text-teal-400 hover:text-teal-300 underline underline-offset-2"
              >
                View Organization
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectList;
