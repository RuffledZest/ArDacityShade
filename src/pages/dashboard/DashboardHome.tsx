import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  {
    title: 'Dive In',
    description: 'Learn about our component library and how to use it',
    items: [
      { name: 'Introduction', path: '/dashboard/introduction' },
      { name: 'How this Works', path: '/dashboard/how-it-works' },
      { name: 'Coming Soon', path: '/dashboard/coming-soon' }
    ]
  },
  {
    title: 'Components',
    description: 'Browse our collection of UI components',
    items: [
      { name: 'Buttons', path: '/dashboard/components/buttons' },
      { name: 'Cards', path: '/dashboard/components/cards' },
      { name: 'Headers', path: '/dashboard/components/headers' },
      { name: 'Navigation', path: '/dashboard/components/navigation' },
      { name: 'Footers', path: '/dashboard/components/footers' },
      { name: 'Loaders', path: '/dashboard/components/loaders' }
    ]
  }
];

const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-2">Welcome to DesignCraft</h1>
      <p className="text-xl text-gray-400 mb-12">
        Create beautiful, consistent, and accessible UIs with our component library
      </p>
      
      {CATEGORIES.map((category) => (
        <div key={category.title} className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-2">{category.title}</h2>
          <p className="text-gray-400 mb-6">{category.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.items.map((item) => (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-6 cursor-pointer transition-colors"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{item.name}</h3>
                <div className="mt-4 flex justify-end">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardHome;