// ============================================
// WordPress REST API Module
// Export all REST API functions
// ============================================

export { 
  fetchREST, 
  fetchPodsFields, 
  fetchPodsFieldsBySlug, 
  fetchFromPodsAPI,
  fetchACFFields,      // Alias for backward compatibility
  fetchACFFieldsBySlug // Alias for backward compatibility
} from './client';
