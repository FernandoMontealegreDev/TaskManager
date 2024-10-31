"use client";

import withAuth from "../components/withAuth";
import TaskList from "../components/TaskList";

/**
 * TasksPage component that displays a list of tasks.
 * It is wrapped with the `withAuth` HOC to ensure that
 * only authenticated users can access this page.
 *
 * @returns {JSX.Element} The rendered TasksPage component
 */
const TasksPage: React.FC = () => {
  return <TaskList />;
};

// Export the TasksPage wrapped with the withAuth HOC
export default withAuth(TasksPage);
