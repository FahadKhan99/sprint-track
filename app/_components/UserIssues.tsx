import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IssueWithProject } from "@/types/types";
import { getUserIssues } from "@/actions/issues.actions";
import UserIssueGrid from "./UserIssueGrid";

const UserIssues = async ({ userId }: { userId: string }) => {
  const issues: IssueWithProject[] = await getUserIssues(userId); // server component can do directly

  if (issues.length === 0) {
    return null;
  }

  const assignedIssues = issues.filter(
    (issue) => issue.assignee.clerkUserId === userId
  );
  const reportedIssues = issues.filter(
    (issue) => issue.reporter.clerkUserId === userId
  );

  return (
    <>
    <h1 className="text-4xl font-bold gradient-title mb-6">My Issues</h1>
  
    <Tabs defaultValue="assigned" className="w-full">
      <TabsList className="bg-muted p-1 rounded-lg w-full mb-4 flex justify-center space-x-2">
        <TabsTrigger
          value="assigned"
          className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded-md"
        >
          Assigned to You
        </TabsTrigger>
        <TabsTrigger
          value="reported"
          className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded-md"
        >
          Reported by You
        </TabsTrigger>
      </TabsList>
  
      <TabsContent value="assigned">
        <UserIssueGrid issues={assignedIssues} />
      </TabsContent>
      <TabsContent value="reported">
        <UserIssueGrid issues={reportedIssues} />
      </TabsContent>
    </Tabs>
  </>
  
  );
};

export default UserIssues;
