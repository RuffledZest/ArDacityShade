import Breadcrumb from '../../components/ui/Breadcrumb';

const HowItWorks: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'Dive In', path: '/dashboard' },
          { label: 'How this Works', path: '/dashboard/how-it-works' }
        ]}
      />
      
      <h1 className="text-3xl font-bold text-white mb-6">How this Works</h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300 mb-4">
          DesignCraft provides a collection of design components that you can use in your projects. 
          Unlike traditional component libraries, we don't provide a package to install. Instead, we 
          provide the code for you to copy and integrate directly into your project.
        </p>
        
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">Using Components</h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-4 mb-4">
          <li>
            <span className="font-medium text-white">Browse components:</span> Navigate to the Components 
            section in the sidebar to see all available component categories.
          </li>
          <li>
            <span className="font-medium text-white">Select a component:</span> Click on a component 
            category to see all available variants of that component.
          </li>
          <li>
            <span className="font-medium text-white">Preview:</span> Each component variant has a preview 
            that shows how it looks and behaves.
          </li>
          <li>
            <span className="font-medium text-white">Get the code:</span> Click on the "Code" tab to see 
            the code for the component. Copy this code and paste it into your project.
          </li>
          <li>
            <span className="font-medium text-white">Customize:</span> Since you now own the code, feel 
            free to customize it to match your project's needs.
          </li>
        </ol>
        
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">For Admin Users</h2>
        <p className="text-gray-300 mb-4">
          If you have admin privileges, you can also contribute to the library by adding new components 
          or variants:
        </p>
        <ol className="list-decimal pl-6 text-gray-300 space-y-4 mb-4">
          <li>
            <span className="font-medium text-white">Add components:</span> Click the "Add Component" 
            button on any component category page.
          </li>
          <li>
            <span className="font-medium text-white">Create or select:</span> You can either create a 
            new component or add a variant to an existing component.
          </li>
          <li>
            <span className="font-medium text-white">Provide details:</span> Fill in the name, description, 
            and code for the component variant.
          </li>
          <li>
            <span className="font-medium text-white">Save:</span> Click "Save Component" to add it to the 
            library.
          </li>
        </ol>
        
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">Best Practices</h2>
        <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
          <li>Use self-contained components that don't require additional imports</li>
          <li>Follow a consistent naming convention for your components</li>
          <li>Test your components across different screen sizes</li>
          <li>Ensure your components are accessible</li>
          <li>Add meaningful comments to your code</li>
        </ul>
      </div>
    </div>
  );
};

export default HowItWorks;