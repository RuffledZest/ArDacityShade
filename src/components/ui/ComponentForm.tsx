import { useState } from 'react';
import { Component, ComponentVariant } from '../../types';

interface ComponentFormProps {
  existingComponents?: Component[];
  onSubmit: (formData: {
    componentId?: string;
    componentName: string;
    variantName: string;
    description: string;
    code: string;
    author: string;
    deployedLink: string;
    isNewComponent: boolean;
  }) => Promise<void>;
  onCancel: () => void;
  initialData?: {
    componentId?: string;
    componentName?: string;
    variantName?: string;
    description?: string;
    code?: string;
    author?: string;
    deployedLink?: string;
  };
}

const ComponentForm: React.FC<ComponentFormProps> = ({
  existingComponents = [],
  onSubmit,
  onCancel,
  initialData = {}
}) => {
  const [isNewComponent, setIsNewComponent] = useState(!initialData.componentId);
  const [selectedComponentId, setSelectedComponentId] = useState(initialData.componentId || '');
  const [componentName, setComponentName] = useState(initialData.componentName || '');
  const [variantName, setVariantName] = useState(initialData.variantName || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [code, setCode] = useState(initialData.code || '');
  const [author, setAuthor] = useState(initialData.author || '');
  const [deployedLink, setDeployedLink] = useState(initialData.deployedLink || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        componentId: isNewComponent ? undefined : selectedComponentId,
        componentName: isNewComponent ? componentName : '',
        variantName,
        description,
        code,
        author,
        deployedLink,
        isNewComponent
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-6">
          {initialData.componentId ? 'Edit Component Variant' : 'Add New Component Variant'}
        </h3>
        
        {/* Component Selection/Creation Toggle */}
        {!initialData.componentId && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Component Type</label>
            <div className="flex space-x-4">
              <label className="flex items-center text-gray-400">
                <input
                  type="radio"
                  checked={!isNewComponent}
                  onChange={() => setIsNewComponent(false)}
                  className="mr-2"
                />
                Use Existing Component
              </label>
              <label className="flex items-center text-gray-400">
                <input
                  type="radio"
                  checked={isNewComponent}
                  onChange={() => setIsNewComponent(true)}
                  className="mr-2"
                />
                Create New Component
              </label>
            </div>
          </div>
        )}
        
        {/* Existing Component Selection */}
        {!isNewComponent && (
          <div className="mb-6">
            <label htmlFor="componentId" className="block text-sm font-medium text-gray-300 mb-2">
              Select Component
            </label>
            <select
              id="componentId"
              value={selectedComponentId}
              onChange={(e) => setSelectedComponentId(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a component</option>
              {existingComponents.map((component) => (
                <option key={component._id} value={component._id}>
                  {component.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* New Component Name */}
        {isNewComponent && (
          <div className="mb-6">
            <label htmlFor="componentName" className="block text-sm font-medium text-gray-300 mb-2">
              Component Name
            </label>
            <input
              id="componentName"
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Button, Card, Header"
              required={isNewComponent}
            />
          </div>
        )}
        
        {/* Variant Name */}
        <div className="mb-6">
          <label htmlFor="variantName" className="block text-sm font-medium text-gray-300 mb-2">
            Variant Name
          </label>
          <input
            id="variantName"
            type="text"
            value={variantName}
            onChange={(e) => setVariantName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Primary, Outline, Gradient"
            required
          />
        </div>
        
        {/* Author */}
        <div className="mb-6">
          <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-2">
            Author
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., @username"
          />
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe this component variant..."
            required
          />
        </div>
        
        {/* Deployed Link */}
        <div className="mb-6">
          <label htmlFor="deployedLink" className="block text-sm font-medium text-gray-300 mb-2">
            Deployed Link (for live preview)
          </label>
          <input
            id="deployedLink"
            type="url"
            value={deployedLink}
            onChange={(e) => setDeployedLink(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/component-preview"
          />
          <p className="mt-1 text-xs text-gray-500">URL where this component is deployed for preview</p>
        </div>
        
        {/* Code */}
        <div className="mb-6">
          <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
            Component Code
          </label>
          <textarea
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={10}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste your component code here..."
            required
          />
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Component'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ComponentForm;