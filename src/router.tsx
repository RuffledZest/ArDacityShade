import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useWallet } from './context/WalletContext';
import App from './App';
import LandingPage from './components/LandingPage';
import Preloader from './components/Preloader';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Introduction from './pages/dashboard/Introduction';
import HowItWorks from './pages/dashboard/HowItWorks';
import ComingSoon from './pages/dashboard/ComingSoon';
import ComponentPage from './pages/dashboard/ComponentPage';
import ManageCategories from './pages/dashboard/ManageCategories';

// Create a standalone ProtectedRoute component for better debugging
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { address } = useWallet();
  
  console.log("ProtectedRoute - Wallet address:", address);
  
  if (address) {
    console.log("ProtectedRoute - Authenticated, rendering children");
    return <>{children}</>;
  }
  
  console.log("ProtectedRoute - Not authenticated, redirecting to landing page");
  return <Navigate to="/" replace />;
};

const AppRouter = () => {
  const [showPreloader, setShowPreloader] = useState(false);
  
  useEffect(() => {
    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem('hasVisited');
    if (!hasVisitedBefore) {
      setShowPreloader(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);
  
  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: [
        {
          index: true,
          element: <LandingPage />,
        },
        {
          path: 'dashboard',
          element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
          children: [
            {
              index: true,
              element: <DashboardHome />,
            },
            {
              path: 'introduction',
              element: <Introduction />,
            },
            {
              path: 'how-it-works',
              element: <HowItWorks />,
            },
            {
              path: 'coming-soon',
              element: <ComingSoon />,
            },
            {
              path: 'components/:category',
              element: <ComponentPage />,
            },
            {
              path: 'manage-categories',
              element: <ManageCategories />,
            },
          ],
        },
      ],
    },
  ]);
  
  return (
    <>
      {showPreloader && (
        <Preloader onComplete={() => setShowPreloader(false)} />
      )}
      <RouterProvider router={router} />
    </>
  );
};

export default AppRouter;