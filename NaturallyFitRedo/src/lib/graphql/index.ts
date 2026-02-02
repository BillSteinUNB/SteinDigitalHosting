// GraphQL exports
export { fetchGraphQL } from './client';
export { 
  getProducts, 
  getProductBySlugGraphQL, 
  getFeaturedProducts, 
  getSaleProducts, 
  getBestSellers,
  getPaginatedProductsGraphQL
} from './products';
export { 
  getCategories, 
  getCategoryBySlug, 
  getFeaturedCategories,
  type CategoryWithCount 
} from './categories';
