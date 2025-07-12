type IFAQS = {
  id: number;
  question: string;
  answer: string;
};

export const FAQs: IFAQS[] = [
  {
    id: 1,
    question: "What is the purpose of this application?",
    answer:
      "This application is designed to help teams manage their tasks and projects efficiently using a Kanban board interface. It allows users to create, assign, and track tasks, facilitating better collaboration and productivity.",
  },
  {
    id: 2,
    question: "How does sprint planning work?",
    answer:
      "Sprint planning allows organization owners or team leads to create focused time-boxed iterations. They can assign issues to sprints, prioritize them, and track their completion across the sprint timeline.",
  },
  {
    id: 3,
    question: "Can I invite team members to my workspace?",
    answer:
      "Yes, organization owners can invite team members via email. Once invited, members can collaborate on tasks, view sprint progress, and update their assigned issues in real time.",
  },
  {
    id: 4,
    question: "Is there support for real-time updates?",
    answer:
      "Yes, the platform supports real-time collaboration, allowing users to see task updates, comments, and status changes instantly without refreshing the page.",
  },
  {
    id: 5,
    question: "Can I use this application for personal task management?",
    answer:
      "Absolutely! While designed for teams, individuals can also use the Kanban board, sprint planner, and reporting features to organize personal projects or freelance work.",
  },
  {
    id: 6,
    question: "Does the app provide analytics or reporting features?",
    answer:
      "Yes, the application includes reporting tools that give insights into sprint progress, completed tasks, team velocity, and more, helping you make informed decisions.",
  },
];
