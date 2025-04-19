import { useEffect, useState } from 'react';
import { Plus, Trash, AlertCircle } from 'lucide-react';
import { getAllCategories, createCategory, deleteCategory } from '../../api/components';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { useWallet } from '../../context/WalletContext';

const ManageCategories: React.FC = () => {
  const [categories, setCategories] = useState<{name: string, _id?: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const { isAdmin } = useWallet();
  
  // Fetch categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Handle creating a new category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) return;
    
    try {
      const newCategory = await createCategory(newCategoryName.trim());
      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName('');
    } catch (err) {
      console.error('Error creating category:', err);
      alert('Failed to create category. Please try again.');
    }
  };
  
  // Handle deleting a category
  const handleDeleteCategory = async (categoryName: string) => {
    if (!window.confirm(`Are you sure you want to delete the "${categoryName}" category?`)) {
      return;
    }
    
    try {
      await deleteCategory(categoryName);
      setCategories(prev => prev.filter(cat => cat.name !== categoryName));
    } catch (err: any) {
      console.error('Error deleting category:', err);
      
      // Check for specific error message about components using the category
      if (err.response?.data?.error?.includes('contains components')) {
        alert('Cannot delete category because it contains components. Delete the components first.');
      } else {
        alert('Failed to delete category. Please try again.');
      }
    }
  };
  
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64 text-amber-400">
        <AlertCircle className="mr-2" />
        <p>You need administrator privileges to manage categories.</p>
      </div>
    );
  }
  
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
      <div className="mb-8">
        <Breadcrumb
          items={[
            { label: 'Components', path: '/dashboard/components' },
            { label: 'Manage Categories', path: '/dashboard/manage-categories' }
          ]}
        />
        <h1 className="text-3xl font-bold text-white">Manage Component Categories</h1>
        <p className="text-gray-400 mt-2">
          Add, edit, or delete component categories. Note that you can only delete empty categories.
        </p>
      </div>
      
      {/* Add new category form */}
      <div className="mb-8 p-6 bg-gray-900 rounded-lg border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">Add New Category</h2>
        <form onSubmit={handleCreateCategory} className="flex">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter category name"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-l-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-1.5" />
            Add
          </button>
        </form>
      </div>
      
      {/* Categories list */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Current Categories</h2>
        </div>
        
        {categories.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No categories found. Add your first category above.
          </div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {categories.map((category) => (
              <li key={category._id || category.name} className="px-6 py-4 flex justify-between items-center">
                <span className="text-white">{category.name}</span>
                <button
                  onClick={() => handleDeleteCategory(category.name)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-800"
                  title={`Delete ${category.name} category`}
                >
                  <Trash size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageCategories; 