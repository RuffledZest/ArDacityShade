import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, AlertCircle } from 'lucide-react';
import { Component, ComponentVariant } from '../../types';
import { 
  getComponentsByCategory, 
  createComponent, 
  createVariant, 
  updateVariant,
  deleteVariant,
  deleteComponent
} from '../../api/components';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ComponentCard from '../../components/ui/ComponentCard';
import ComponentForm from '../../components/ui/ComponentForm';
import { useWallet } from '../../context/WalletContext';

const ComponentPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [components, setComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { isAdmin } = useWallet();
  const [editingVariant, setEditingVariant] = useState<{
    componentId: string;
    variantId: string;
    componentName: string;
    variantName: string;
    description: string;
    code: string;
    author: string;
    deployedLink: string;
    packageCommands: string;
    imageUrl: string;
  } | null>(null);
  
  // Format the category name for display
  const formatCategoryName = (name?: string) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1);
  };
  
  // Fetch components when the category changes
  useEffect(() => {
    const fetchComponents = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (category) {
          const data = await getComponentsByCategory(category);
          setComponents(data);
        }
      } catch (err) {
        setError('Failed to load components. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchComponents();
  }, [category]);
  
  // Handle form submission for adding a new component or variant
  const handleFormSubmit = async (formData: {
    componentId?: string;
    componentName: string;
    variantName: string;
    description: string;
    code: string;
    author: string;
    deployedLink: string;
    packageCommands: string;
    imageUrl: string;
    isNewComponent: boolean;
  }) => {
    try {
      if (editingVariant) {
        // Update existing variant
        const updatedVariant = await updateVariant(
          editingVariant.componentId,
          editingVariant.variantId,
          {
            name: formData.variantName,
            description: formData.description,
            code: formData.code,
            author: formData.author,
            deployedLink: formData.deployedLink,
            packageCommands: formData.packageCommands,
            imageUrl: formData.imageUrl
          }
        );
        
        // Update state
        setComponents(prev => prev.map(comp => {
          if (comp._id === editingVariant.componentId) {
            return {
              ...comp,
              variants: comp.variants.map(v => 
                v._id === editingVariant.variantId ? {
                  ...v,
                  name: updatedVariant.name,
                  description: updatedVariant.description,
                  code: updatedVariant.code,
                  author: updatedVariant.author || '',
                  deployedLink: updatedVariant.deployedLink || '',
                  packageCommands: updatedVariant.packageCommands || '',
                  imageUrl: updatedVariant.imageUrl || ''
                } : v
              )
            };
          }
          return comp;
        }));
        
        setEditingVariant(null);
      } else if (formData.isNewComponent) {
        // Create a new component with the first variant
        const newComponent = await createComponent({
          name: formData.componentName,
          category: category || 'unknown',
          description: formData.description,
          variants: [{
            name: formData.variantName,
            description: formData.description,
            code: formData.code,
            author: formData.author,
            deployedLink: formData.deployedLink,
            packageCommands: formData.packageCommands,
            imageUrl: formData.imageUrl
          }]
        });
        
        setComponents(prev => [...prev, newComponent]);
      } else if (formData.componentId) {
        // Add a new variant to an existing component
        const newVariant = await createVariant(formData.componentId, {
          name: formData.variantName,
          description: formData.description,
          code: formData.code,
          author: formData.author,
          deployedLink: formData.deployedLink,
          packageCommands: formData.packageCommands,
          imageUrl: formData.imageUrl
        });
        
        // Update the local state with the new variant
        setComponents(prev => prev.map(comp => {
          if (comp._id === formData.componentId) {
            return {
              ...comp,
              variants: [...comp.variants, newVariant]
            };
          }
          return comp;
        }));
      }
      
      setShowForm(false);
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Failed to save component. Please try again.');
    }
  };
  
  // Handle editing a variant
  const handleEditVariant = (componentId: string, variantId: string) => {
    const component = components.find(c => c._id === componentId);
    if (!component) return;
    
    const variant = component.variants.find(v => v._id === variantId);
    if (!variant) return;
    
    setEditingVariant({
      componentId,
      variantId,
      componentName: component.name,
      variantName: variant.name,
      description: variant.description,
      code: variant.code,
      author: variant.author || '',
      deployedLink: variant.deployedLink || '',
      packageCommands: variant.packageCommands || '',
      imageUrl: variant.imageUrl || ''
    });
    
    setShowForm(true);
  };
  
  // Handle deleting a variant
  const handleDeleteVariant = async (componentId: string, variantId: string) => {
    try {
      await deleteVariant(componentId, variantId);
      
      // Update local state
      const updatedComponents = components.map(comp => {
        if (comp._id === componentId) {
          const updatedVariants = comp.variants.filter(v => v._id !== variantId);
          
          if (updatedVariants.length === 0) {
            // If this was the last variant, we'll remove the whole component
            return null;
          }
          
          return {
            ...comp,
            variants: updatedVariants
          };
        }
        return comp;
      }).filter(Boolean) as Component[];
      
      setComponents(updatedComponents);
    } catch (err) {
      console.error('Error deleting variant:', err);
      alert('Failed to delete variant. Please try again.');
    }
  };
  
  // Handle canceling form edit
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingVariant(null);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400">
        <AlertCircle className="mr-2" />
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Breadcrumb
            items={[
              { label: 'Components', path: '/dashboard/components' },
              { label: formatCategoryName(category), path: `/dashboard/components/${category}` }
            ]}
          />
          <h1 className="text-3xl font-bold text-white">{formatCategoryName(category)} Components</h1>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => {
              setEditingVariant(null);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-1.5" />
            Add Component
          </button>
        )}
      </div>
      
      {showForm && (
        <div className="mb-12">
          <ComponentForm
            existingComponents={components}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            initialData={editingVariant || undefined}
          />
        </div>
      )}
      
      {components.length === 0 ? (
        <div className="text-center p-12 border border-dashed border-gray-700 rounded-lg">
          <p className="text-gray-400 mb-2">No components found in this category.</p>
          {isAdmin && (
            <button
              onClick={() => {
                setEditingVariant(null);
                setShowForm(true);
              }}
              className="text-blue-400 hover:text-blue-300"
            >
              Add your first component
            </button>
          )}
        </div>
      ) : (
        components.map((component) => (
          <div key={component._id} className="mb-12">
            {component.variants.map((variant) => (
              <ComponentCard
                key={variant._id}
                title={variant.name}
                description={variant.description}
                code={variant.code}
                author={variant.author}
                deployedLink={variant.deployedLink}
                packageCommands={variant.packageCommands}
                imageUrl={variant.imageUrl}
                componentId={component._id}
                variantId={variant._id}
                onEdit={handleEditVariant}
                onDelete={handleDeleteVariant}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ComponentPage;