import { Outlet } from 'react-router-dom';
import Sidebar from '../ui/Sidebar';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;