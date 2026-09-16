// PartnerWithUs/utils/helpers.js

import { CATEGORY_TITLE_MAP } from "../constants";

export const getCategoryTitle = (type) => {
  return CATEGORY_TITLE_MAP[type] || "Categories";
};

export const toggleItem = (array, itemId, maxItems = null) => {
  const isSelected = array.includes(itemId);
  
  if (isSelected) {
    return array.filter(id => id !== itemId);
  }
  
  if (maxItems && array.length >= maxItems) {
    return array;
  }
  
  return [...array, itemId];
};

export const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const generateId = () => {
  return Date.now() + Math.random().toString(36).substring(2, 9);
};

export const isImageFile = (file) => {
  return file.type.startsWith('image/');
};

export const getCategoryDisplay = (categories, categoryList) => {
  return categories
    .map(id => categoryList.find(c => c.id === id)?.label || id)
    .join(', ');
};