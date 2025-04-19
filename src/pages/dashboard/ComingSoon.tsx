import Breadcrumb from '../../components/ui/Breadcrumb';

const ComingSoon: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'Dive In', path: '/dashboard' },
          { label: 'Coming Soon', path: '/dashboard/coming-soon' }
        ]}
      />
      
      <h1 className="text-3xl font-bold text-white mb-6">Coming Soon</h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300 mb-6">
          We're constantly working on improving DesignCraft and adding new features. Here's what 
          you can expect in the coming updates:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Feature 1 */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Live Component Preview</h3>
            <p className="text-gray-400">
              Real-time previews of components with the ability to modify props and see how they 
              affect the component.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Theme Customization</h3>
            <p className="text-gray-400">
              Customize the color scheme, typography, and spacing of components to match your brand.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Component Playground</h3>
            <p className="text-gray-400">
              Interactive sandbox where you can experiment with components and see how they work 
              together.
            </p>
          </div>
          
          {/* Feature 4 */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Template Library</h3>
            <p className="text-gray-400">
              Pre-built templates using our components for common UI patterns and layouts.
            </p>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">Request a Feature</h2>
        <p className="text-gray-300 mb-4">
          Have a suggestion for a feature or component you'd like to see? We'd love to hear from you!
          Connect with our team to share your ideas and help shape the future of DesignCraft.
        </p>
        
        <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">Stay Updated</h3>
          <p className="text-gray-300 mb-4">
            Join our community to get notified when new features are released and be the first to 
            try them out.
          </p>
          <a 
            href="#"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            Join the Community
          </a>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;