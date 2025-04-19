import axios from 'axios';
import { Component, ComponentVariant } from '../types';

// Determine the API URL based on environment
// Try Vite's import.meta.env first, then process.env as fallback
const API_URL = import.meta.env.VITE_API_URL || 
                (typeof process !== 'undefined' && process.env?.VITE_API_URL) || 
                'http://localhost:5000/api';

console.log('API URL:', API_URL);

// Category APIs
export const getAllCategories = async (): Promise<{name: string, _id?: string}[]> => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const createCategory = async (name: string): Promise<{name: string, _id: string}> => {
  try {
    const response = await axios.post(`${API_URL}/categories`, { name });
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const deleteCategory = async (name: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/categories/${name}`);
  } catch (error) {
    console.error(`Error deleting category ${name}:`, error);
    throw error;
  }
};

// Component APIs
export const getAllComponents = async (): Promise<Component[]> => {
  try {
    const response = await axios.get(`${API_URL}/components`);
    return response.data;
  } catch (error) {
    console.error('Error fetching components:', error);
    throw error;
  }
};

// Get a single component by ID
export const getComponentById = async (id: string): Promise<Component> => {
  try {
    const response = await axios.get(`${API_URL}/components/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching component ${id}:`, error);
    throw error;
  }
};

// Get components by category
export const getComponentsByCategory = async (category: string): Promise<Component[]> => {
  try {
    const response = await axios.get(`${API_URL}/components/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching components by category ${category}:`, error);
    throw error;
  }
};

// Create a new component
export const createComponent = async (component: Partial<Component>): Promise<Component> => {
  try {
    const response = await axios.post(`${API_URL}/components`, component);
    return response.data;
  } catch (error) {
    console.error('Error creating component:', error);
    throw error;
  }
};

// Update an existing component
export const updateComponent = async (id: string, component: Partial<Component>): Promise<Component> => {
  try {
    const response = await axios.put(`${API_URL}/components/${id}`, component);
    return response.data;
  } catch (error) {
    console.error(`Error updating component ${id}:`, error);
    throw error;
  }
};

// Delete a component
export const deleteComponent = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/components/${id}`);
  } catch (error) {
    console.error(`Error deleting component ${id}:`, error);
    throw error;
  }
};

// Create a new variant for a component
export const createVariant = async (
  componentId: string, 
  variant: Partial<ComponentVariant>
): Promise<ComponentVariant> => {
  try {
    const response = await axios.post(`${API_URL}/components/${componentId}/variants`, variant);
    return response.data;
  } catch (error) {
    console.error(`Error creating variant for component ${componentId}:`, error);
    throw error;
  }
};

// Update an existing variant
export const updateVariant = async (
  componentId: string,
  variantId: string,
  variant: Partial<ComponentVariant>
): Promise<ComponentVariant> => {
  try {
    const response = await axios.put(
      `${API_URL}/components/${componentId}/variants/${variantId}`, 
      variant
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating variant ${variantId} for component ${componentId}:`, error);
    throw error;
  }
};

// Delete a variant
export const deleteVariant = async (componentId: string, variantId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/components/${componentId}/variants/${variantId}`);
  } catch (error) {
    console.error(`Error deleting variant ${variantId} for component ${componentId}:`, error);
    throw error;
  }
};