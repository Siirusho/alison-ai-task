import ErrorBoundary from "@/src/components/ErrorBoundary";
import CrossTabCollaborationDashboard from "../src/components/Dashboard"

const DashboardPage = () => {
  return (
    <ErrorBoundary>
      <CrossTabCollaborationDashboard />
    </ErrorBoundary>
  )
}

export default DashboardPage;