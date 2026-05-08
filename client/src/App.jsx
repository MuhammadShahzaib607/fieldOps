import { Route, Routes } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import DashboardLayout from "./routes/DashboardRoutes";
import AllJobs from "./pages/dashboard/admin/AllJobs";
import CreateJob from "./pages/dashboard/admin/CreateJob";
import AllUsers from "./pages/dashboard/admin/AllUsers";
import PendingJobs from "./pages/dashboard/admin/PendingJobs";
import InProgressJobs from "./pages/dashboard/admin/InProgressJobs.jsx";
import CompletedJobs from "./pages/dashboard/admin/CompletedJobs.jsx";
import CancelledJobs from "./pages/dashboard/admin/CancelledJobs.jsx";
import EditJob from "./pages/dashboard/admin/EditJob.jsx";
import AddNote from "./pages/dashboard/AddNote.jsx";
import ClientOrders from "./pages/dashboard/client/ClientOrders.jsx";
import PendingOrders from "./pages/dashboard/client/PendingOrders.jsx";
import InProgressOrders from "./pages/dashboard/client/InProgressOrders.jsx";
import CompletedOrders from "./pages/dashboard/client/CompletedOrders.jsx";
import CancelledOrders from "./pages/dashboard/client/CancelledOrders.jsx";
import WorkerTasks from "./pages/dashboard/worker/MyTasks.jsx";
import PendingTasks from "./pages/dashboard/worker/PendingTasks.jsx";
import InProgressTasks from "./pages/dashboard/worker/InProgressTasks.jsx";
import CompletedTasks from "./pages/dashboard/worker/CompletedTasks.jsx";
import CancelledTasks from "./pages/dashboard/worker/CancelledTasks.jsx";

function App() {

  return (
    <>
    <Routes>
      <Route index element={<Signup />} />
      <Route path="/login" element={<Login />} />

<Route element={<DashboardLayout />}>
      <Route path="/all-jobs" element={<AllJobs />} />
      <Route path="/create-job" element={<CreateJob />} />
      <Route path="/users" element={<AllUsers />} />
      <Route path="/admin/jobs/pending" element={<PendingJobs />} />
      <Route path="/admin/jobs/in-progress" element={<InProgressJobs />} />
      <Route path="/admin/jobs/completed" element={<CompletedJobs />} />
      <Route path="/admin/jobs/cancelled" element={<CancelledJobs />} />
      <Route path="/edit-job/:id" element={<EditJob />} />

      <Route path="/all-orders" element={<ClientOrders />} />
      <Route path="/client/jobs/pending" element={<PendingOrders />} />
      <Route path="/client/jobs/in-progress" element={<InProgressOrders />} />
      <Route path="/client/jobs/completed" element={<CompletedOrders />} />
      <Route path="/client/jobs/cancelled" element={<CancelledOrders />} />
      
      <Route path="/my-tasks" element={<WorkerTasks />} />
      <Route path="/worker/jobs/pending" element={<PendingTasks />} />
      <Route path="/worker/jobs/in-progress" element={<InProgressTasks />} />
      <Route path="/worker/jobs/completed" element={<CompletedTasks />} />
      <Route path="/worker/jobs/cancelled" element={<CancelledTasks />} />

      <Route path="/add-note/:id" element={<AddNote />} />
</Route>

    </Routes>
    </>
  )
}

export default App
