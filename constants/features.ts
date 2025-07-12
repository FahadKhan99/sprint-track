import {
  CheckSquare,
  Layout,
  Calendar,
  LucideIcon,
  BarChart2,
  Bell,
  Users,
} from "lucide-react";

type IFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const Features: IFeature[] = [
  {
    title: "Task Management",
    description:
      "Create, assign, and organize tasks efficiently to keep your team aligned and focused on the right priorities.",
    icon: CheckSquare,
  },
  {
    title: "Intuitive Kanban Board",
    description:
      "Visualize your workflow with a drag-and-drop Kanban interface that adapts to your team's process.",
    icon: Layout,
  },
  {
    title: "Powerful Sprint Planning",
    description:
      "Define sprint goals, assign issues to team members, and track progress with real-time insights and burndown metrics.",
    icon: Calendar,
  },
  {
    title: "Comprehensive Reporting",
    description:
      "Gain insights with detailed analytics on team performance, sprint velocity, and bottlenecks across your workflow.",
    icon: BarChart2,
  },
  {
    title: "Team Collaboration",
    description:
      "Invite team members, assign roles, and collaborate in real time with comments, mentions, and shared visibility.",
    icon: Users,
  },
  {
    title: "Smart Notifications",
    description:
      "Stay in the loop with customizable, context-aware alerts so you never miss an important update or deadline.",
    icon: Bell,
  },
];
