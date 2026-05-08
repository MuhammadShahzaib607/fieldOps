import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar /> 
      <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
        <main className="p-8">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;