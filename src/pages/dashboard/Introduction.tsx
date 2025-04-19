import Breadcrumb from '../../components/ui/Breadcrumb';

const Introduction: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'Dive In', path: '/dashboard' },
          { label: 'Introduction', path: '/dashboard/introduction' }
        ]}
      />
      
      <h1 className="text-3xl font-bold text-white mb-6">Introduction</h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300 mb-4">
          Welcome to DesignCraft, a modern component library that helps you build beautiful, 
          accessible, and consistent user interfaces. Our library provides a collection of 
          reusable components that you can easily integrate into your projects.
        </p>
        
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">What is DesignCraft?</h2>
        <p className="text-gray-300 mb-4">
          DesignCraft is a component library that focuses on providing clean, elegant UI 
          components with accessible and customizable implementations. Similar to libraries 
          like shadcn/ui, we provide the code directly to you, allowing you to own and 
          customize the components as needed.
        </p>
        
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">Key Features</h2>
        <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
          <li>Beautiful, minimal design aesthetic</li>
          <li>Copy-and-paste approach - you own the code</li>
          <li>Multiple variants for each component</li>
          <li>Accessibility built-in</li>
          <li>Responsive by default</li>
          <li>Dark mode support</li>
        </ul>
        
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">Getting Started</h2>
        <p className="text-gray-300 mb-4">
          Navigate to the Components section in the sidebar to explore all available components. Each 
          component includes multiple variants, along with code snippets that you can copy and use in 
          your projects.
        </p>
        <p className="text-gray-300 mb-4">
          For more information on how to use the library effectively, check out the "How this Works" 
          section.
        </p>
      </div>
    </div>
  );
};

export default Introduction;