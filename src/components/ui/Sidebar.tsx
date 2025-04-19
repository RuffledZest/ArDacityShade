import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  BookOpen,
  Component as Components,
  ChevronDown,
  ChevronRight,
  LogOut,
  Settings,
  Plus
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

interface SidebarCategory {
  name: string;
  icon: React.ReactNode;
  items: {
    name: string;
    path: string;
  }[];
}

const Sidebar: React.FC = () => {
  const { disconnect, isAdmin } = useWallet();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "Dive In": true,
    "Components": true,
    "Admin": true
  });
  
  const categories: SidebarCategory[] = [
    {
      name: "Dive In",
      icon: <BookOpen size={18} />,
      items: [
        { name: "Introduction", path: "/dashboard/introduction" },
        { name: "How this Works", path: "/dashboard/how-it-works" },
        { name: "Coming Soon", path: "/dashboard/coming-soon" }
      ]
    },
    {
      name: "Components",
      icon: <Components size={18} />,
      items: [
        { name: "Buttons", path: "/dashboard/components/buttons" },
        { name: "Cards", path: "/dashboard/components/cards" },
        { name: "Headers", path: "/dashboard/components/headers" },
        { name: "Navigation", path: "/dashboard/components/navigation" },
        { name: "Footers", path: "/dashboard/components/footers" },
        { name: "Loaders", path: "/dashboard/components/loaders" },
        { name: "Bento Grids", path: "/dashboard/components/bento-grids" }
      ]
    }
  ];

  // Admin section only shown to admins
  if (isAdmin) {
    categories.push({
      name: "Admin",
      icon: <Settings size={18} />,
      items: [
        { name: "Manage Categories", path: "/dashboard/manage-categories" }
      ]
    });
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="w-64 h-screen bg-gray-950 border-r border-gray-800 overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center">
          <span className="text-xl font-bold text-white">DesignCraft</span>
        </div>
      </div>
      
      <div className="flex-1 py-4">
        {categories.map((category) => (
          <div key={category.name} className="mb-4">
            <button
              onClick={() => toggleCategory(category.name)}
              className="flex items-center justify-between w-full px-4 py-2 text-gray-400 hover:text-white"
            >
              <div className="flex items-center">
                {category.icon}
                <span className="ml-2 font-medium">{category.name}</span>
              </div>
              {expandedCategories[category.name] ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
            
            {expandedCategories[category.name] && (
              <div className="mt-1 pl-6">
                {category.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 text-sm ${
                        isActive
                          ? "text-white bg-gray-800 rounded-md"
                          : "text-gray-400 hover:text-white"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                
                {category.name === "Components" && isAdmin && (
                  <NavLink 
                    to="/dashboard/manage-categories"
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 mt-2 text-sm ${
                        isActive
                          ? "text-white bg-blue-700 rounded-md"
                          : "text-blue-400 bg-gray-800 rounded-md hover:bg-gray-700"
                      }`
                    }
                  >
                    <Plus size={14} className="mr-1.5" />
                    Add Category
                  </NavLink>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={disconnect}
          className="flex items-center w-full px-4 py-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          <LogOut size={18} />
          <span className="ml-2">Disconnect</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;