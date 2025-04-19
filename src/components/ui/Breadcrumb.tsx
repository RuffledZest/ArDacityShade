import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center text-sm text-gray-400 mb-6">
      {items.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && (
            <ChevronRight size={16} className="mx-2 text-gray-500" />
          )}
          {index === items.length - 1 ? (
            <span className="text-gray-300">{item.label}</span>
          ) : (
            <Link 
              to={item.path} 
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;