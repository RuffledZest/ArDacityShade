import { useState } from 'react';
import { Code, Eye, Copy, Check, Trash, Edit, Package } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface ComponentCardProps {
  title: string;
  description: string;
  code: string;
  author?: string;
  deployedLink?: string;
  packageCommands?: string;
  imageUrl?: string;
  componentId?: string;
  variantId?: string;
  onEdit?: (componentId: string, variantId: string) => void;
  onDelete?: (componentId: string, variantId: string) => void;
  isAdmin?: boolean;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  description,
  code,
  author,
  deployedLink,
  packageCommands,
  
  componentId,
  variantId,
  onEdit,
  onDelete,
  isAdmin = false
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'packages'>('preview');
  const [isCopied, setIsCopied] = useState(false);
  const [isPackageCopied, setIsPackageCopied] = useState(false);

  // Handle copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Handle copy package commands to clipboard
  const handleCopyPackageCommands = () => {
    if (packageCommands) {
      navigator.clipboard.writeText(packageCommands).then(() => {
        setIsPackageCopied(true);
        setTimeout(() => setIsPackageCopied(false), 2000);
      });
    }
  };

  // Handle edit component
  const handleEdit = () => {
    if (onEdit && componentId && variantId) {
      onEdit(componentId, variantId);
    }
  };

  // Handle delete component
  const handleDelete = () => {
    if (onDelete && componentId && variantId) {
      if (window.confirm(`Are you sure you want to delete this ${title} variant?`)) {
        onDelete(componentId, variantId);
      }
    }
  };

  return (
    <div className="mb-12 w-full">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          {author && <p className="text-sm text-gray-500 mb-1">By {author}</p>}
        </div>
        
        {isAdmin && componentId && variantId && (
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-gray-800"
              title="Edit variant"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-800"
              title="Delete variant"
            >
              <Trash size={16} />
            </button>
          </div>
        )}
      </div>
      
      <p className="text-gray-400 mb-4">{description}</p>
      
      {/* {imageUrl && (
        <div className="mb-4 rounded-lg overflow-hidden border border-gray-800">
          <img src={imageUrl} alt={title} className="w-full h-auto object-cover max-h-[300px]" />
        </div>
      )} */}
      
      <div className="border border-gray-800 rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center justify-between bg-gray-900 border-b border-gray-800 px-4 py-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center px-3 py-1 text-sm rounded-md ${
                activeTab === 'preview'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Eye size={16} className="mr-1.5" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center px-3 py-1 text-sm rounded-md ${
                activeTab === 'code'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Code size={16} className="mr-1.5" />
              Code
            </button>
            {packageCommands && (
              <button
                onClick={() => setActiveTab('packages')}
                className={`flex items-center px-3 py-1 text-sm rounded-md ${
                  activeTab === 'packages'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Package size={16} className="mr-1.5" />
                Packages
              </button>
            )}
          </div>
          
          {activeTab === 'code' && (
            <button
              onClick={handleCopyCode}
              className="flex items-center px-3 py-1 text-sm rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
              title="Copy code to clipboard"
            >
              {isCopied ? (
                <>
                  <Check size={16} className="mr-1.5 text-green-500" />
                  <span className="text-green-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} className="mr-1.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
          
          {activeTab === 'packages' && (
            <button
              onClick={handleCopyPackageCommands}
              className="flex items-center px-3 py-1 text-sm rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
              title="Copy package commands to clipboard"
            >
              {isPackageCopied ? (
                <>
                  <Check size={16} className="mr-1.5 text-green-500" />
                  <span className="text-green-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} className="mr-1.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="bg-gray-950">
          {activeTab === 'preview' ? (
            <div className="min-h-[300px]">
              {deployedLink ? (
                <iframe 
                  src={deployedLink}
                  title={`Preview of ${title}`}
                  className="w-full h-[300px] border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  loading="lazy"
                />
              ) : (
                <div className="text-gray-500 italic text-center p-6 h-full flex items-center justify-center">
                  <p>No live preview available</p>
                </div>
              )}
            </div>
          ) : activeTab === 'code' ? (
            <SyntaxHighlighter
              language="jsx"
              style={atomOneDark}
              customStyle={{
                borderRadius: '4px',
                margin: 0,
                padding: '16px',
                background: '#0d1117'
              }}
            >
              {code}
            </SyntaxHighlighter>
          ) : (
            <SyntaxHighlighter
              language="bash"
              style={atomOneDark}
              customStyle={{
                borderRadius: '4px',
                margin: 0,
                padding: '16px',
                background: '#0d1117'
              }}
            >
              {packageCommands || '# No package commands specified'}
            </SyntaxHighlighter>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentCard;