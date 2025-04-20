# Component Library API Documentation

This document provides information on how to integrate with the Ardacity Component Library API to fetch components for use in the Website Builder project.

## API Endpoints

### Components

#### Get All Components
```
GET /api/components
```
Returns all components in the library.

#### Get Component by ID
```
GET /api/components/:id
```
Returns a specific component by its ID.

#### Get Components by Category
```
GET /api/components/category/:category
```
Returns all components belonging to a specific category.

### Component Structure

Each component has the following structure:

```json
{
  "_id": "component_id",
  "name": "Component Name",
  "category": "Category Name",
  "description": "Component description",
  "variants": [
    {
      "_id": "variant_id",
      "name": "Variant Name",
      "description": "Variant description",
      "code": "JSX/React code for the component",
      "author": "Author name",
      "deployedLink": "URL to preview the component",
      "packageCommands": "npm install package1 package2 --save",
      "imageUrl": "URL to the component preview image",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Integration with Website Builder

### Fetching Components

To fetch components for your Website Builder:

1. Use the API endpoints to retrieve components by category or all at once
2. Store the components in your Website Builder's state
3. Display components in a gallery based on their categories
4. Use the `imageUrl` to display a preview of each component
5. When a user selects a component, use the component's code to render it in your canvas

### Installing Dependencies

When a user adds a component to their project:

1. Parse the `packageCommands` field from the component's variant
2. Add these dependencies to your project's package.json
3. Run the package installation commands when setting up the new project

### Rendering Components

To render components in the Website Builder:

1. Create a dynamic component loader that can interpret the component code
2. When a user drags a component onto the canvas, render the code in a sandboxed environment
3. Allow users to customize the component's props and content
4. Generate the final website code by combining all the selected components

### Example Implementation

Here's a simplified example of how to fetch and use components in your Website Builder:

```javascript
// Fetch components for the gallery
const fetchComponents = async (category) => {
  try {
    const response = await fetch(`http://your-api-url/api/components/category/${category}`);
    const components = await response.json();
    return components;
  } catch (error) {
    console.error('Error fetching components:', error);
    return [];
  }
};

// Add a component to the canvas
const addComponentToCanvas = (component, variant) => {
  // Add the component to the user's project
  projectComponents.push({
    id: component._id,
    variantId: variant._id,
    name: component.name,
    code: variant.code,
    // Other component properties
  });
  
  // Extract required packages
  const packageCommands = variant.packageCommands;
  if (packageCommands) {
    // Add these to your project's dependencies
    addDependenciesToProject(packageCommands);
  }
  
  // Render the component on the canvas
  renderComponentOnCanvas(variant.code);
};
```

## Code Generation with AI

When integrating with an AI code generator:

1. Provide the AI with the component code, package dependencies, and user customizations
2. Instruct the AI to generate a complete project structure with proper imports
3. The AI should organize components into appropriate files based on component type and function
4. Generate a main file (e.g., App.jsx) that imports and combines all components

### Example AI Prompt Template

```
Generate a complete React website project based on the following components:

Components:
[List of components with their code]

Dependencies:
[List of package dependencies extracted from packageCommands]

Requirements:
1. Create separate files for each component in a components/ directory
2. Structure the files logically (e.g., navigation components in components/navigation/)
3. Create a main App.jsx file that imports and uses all components
4. Make the components work together as a cohesive website
5. Ensure all imports are correct and all dependencies are used properly
```

## Best Practices

1. Cache components locally to reduce API calls
2. Implement pagination if you have a large component library
3. Add search and filtering capabilities to help users find components
4. Validate component code before rendering it in your Website Builder
5. Provide clear error handling for cases where components fail to load or render

## API Authentication

Currently, the API is open for read operations. If authentication is implemented in the future, you'll need to include an authentication header in your requests:

```javascript
const fetchComponents = async (category) => {
  try {
    const response = await fetch(`http://your-api-url/api/components/category/${category}`, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY'
      }
    });
    const components = await response.json();
    return components;
  } catch (error) {
    console.error('Error fetching components:', error);
    return [];
  }
};
``` 