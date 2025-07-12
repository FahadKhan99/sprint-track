import { getProjectById } from "@/actions/projects.actions";
import CreateSprintForm from "@/app/_components/CreateSprintForm";
import SprintBoard from "@/app/_components/SprintBoard";
import { notFound } from "next/navigation";

type Params = {
  params: {
    projectId: string;
  };
};

const ProjectPage = async ({ params }: Params) => {
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }
  return (
    <div className="container mx-auto">
      {/* sprint creation */}
      <CreateSprintForm
        projectTitle={project.name}
        projectId={project.id}
        projectKey={project.key}
        sprintKey={project.sprints.length + 1}
      />
      {/* sprint board */}
      {project.sprints.length > 0 ? (
        <SprintBoard
          sprints={project.sprints}
          projectId={project.id}
          organizationId={project.organizationId}
        />
      ) : (
        <div>Create a sprint from button above</div>
      )}
    </div>
  );
};

export default ProjectPage;
