import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '@/pages/Index';
import { Storage } from '@/lib/storage';

// Extended interfaces for merchant management
export interface MerchantCategory {
  id: string;
  nameKey: string;
  descKey: string;
  icon: string; // Store as string, will be mapped to icons
  gradient: string;
  isActive: boolean;
  merchantId?: string; // Track which merchant owns this category
}

export interface MerchantSubCategory {
  id: string;
  categoryIds: string[]; // Changed from categoryId: string
  nameKey: string;
  descKey: string;
  icon: string;
  gradient: string;
  isActive: boolean;
  merchantId?: string;
}

export interface MerchantProduct extends Product {
  nameKey: string; // Always required for merchant products
  descKey: string; // Always required for merchant products
  isActive: boolean;
  merchantId?: string;
}

// Storage key for merchant-specific data
const STORAGE_KEY = 'merchant_product_data';

type MerchantDataStructure = { categories: MerchantCategory[], subCategories: MerchantSubCategory[], products: MerchantProduct[] };

// Function to load merchant-specific data from cookies
const loadMerchantData = (merchantId?: string): MerchantDataStructure | null => {
  try {
    const allData = Storage.get<Record<string, MerchantDataStructure>>('merchant_product_data');
    if (merchantId && allData && allData[merchantId]) {
      return allData[merchantId];
    }
  } catch (error) {
    console.error('Error loading merchant data:', error);
  }
  return null;
};

// Function to save merchant-specific data to cookies
const saveMerchantData = (merchantId: string, data: MerchantDataStructure) => {
  try {
    const existingData = Storage.get<Record<string, MerchantDataStructure>>('merchant_product_data') || {};
    existingData[merchantId] = data;
    Storage.set('merchant_product_data', existingData);
  } catch (error) {
    console.error('Error saving merchant data:', error);
  }
};

// Default data structure that matches current hardcoded data
const DEFAULT_CATEGORIES: MerchantCategory[] = [
  {
    id: 'mens',
    nameKey: 'categories.mensApparel',
    descKey: 'categories.mensApparelDesc',
    icon: 'Shirt',
    gradient: 'from-blue-500 to-blue-600',
    isActive: true
  },
  {
    id: 'womens',
    nameKey: 'categories.womensApparel',
    descKey: 'categories.womensApparelDesc',
    icon: 'User',
    gradient: 'from-pink-500 to-rose-600',
    isActive: true
  },
  {
    id: 'kids',
    nameKey: 'categories.kidsClothing',
    descKey: 'categories.kidsClothingDesc',
    icon: 'Baby',
    gradient: 'from-green-500 to-emerald-600',
    isActive: true
  },
  {
    id: 'footwear',
    nameKey: 'categories.footwear',
    descKey: 'categories.footwearDesc',
    icon: 'Footprints',
    gradient: 'from-orange-500 to-amber-600',
    isActive: true
  },
  {
    id: 'accessories',
    nameKey: 'categories.accessories',
    descKey: 'categories.accessoriesDesc',
    icon: 'Watch',
    gradient: 'from-purple-500 to-violet-600',
    isActive: true
  },
  {
    id: 'sale',
    nameKey: 'categories.sale',
    descKey: 'categories.saleDesc',
    icon: 'Tag',
    gradient: 'from-red-500 to-pink-600',
    isActive: true
  }
];

const DEFAULT_SUBCATEGORIES: MerchantSubCategory[] = [
  // Men's subcategories
  {
    id: 'tshirts-mens',
    categoryIds: ['mens'],
    nameKey: 'subcategories.tshirts',
    descKey: 'subcategories.tshirtsDesc',
    icon: 'Shirt',
    gradient: 'from-blue-500 to-blue-600',
    isActive: true
  },
  {
    id: 'shirts-mens',
    categoryIds: ['mens'],
    nameKey: 'subcategories.shirts',
    descKey: 'subcategories.shirtsDesc',
    icon: 'Package',
    gradient: 'from-indigo-500 to-indigo-600',
    isActive: true
  },
  {
    id: 'jeans-mens',
    categoryIds: ['mens'],
    nameKey: 'subcategories.jeans',
    descKey: 'subcategories.jeansDesc',
    icon: 'Scissors',
    gradient: 'from-gray-500 to-gray-600',
    isActive: true
  },
  {
    id: 'jackets-mens',
    categoryIds: ['mens'],
    nameKey: 'subcategories.jackets',
    descKey: 'subcategories.jacketsDesc',
    icon: 'Zap',
    gradient: 'from-green-500 to-green-600',
    isActive: true
  },
  // Women's subcategories
  {
    id: 'tshirts-womens',
    categoryIds: ['womens'],
    nameKey: 'subcategories.tshirts',
    descKey: 'subcategories.tshirtsDesc',
    icon: 'Shirt',
    gradient: 'from-pink-500 to-pink-600',
    isActive: true
  },
  {
    id: 'blouses-womens',
    categoryIds: ['womens'],
    nameKey: 'subcategories.blouses',
    descKey: 'subcategories.blousesDesc',
    icon: 'Package',
    gradient: 'from-rose-500 to-rose-600',
    isActive: true
  },
  // Kids subcategories
  {
    id: 'tshirts-kids',
    categoryIds: ['kids'],
    nameKey: 'subcategories.tshirts',
    descKey: 'subcategories.tshirtsDesc',
    icon: 'Shirt',
    gradient: 'from-yellow-500 to-yellow-600',
    isActive: true
  }
];

const DEFAULT_PRODUCTS: MerchantProduct[] = [
  // Men's T-Shirts
  {
    id: '1',
    nameKey: 'products.whiteTshirt',
    name: 'White Crew Neck T-Shirt',
    price: 24.99,
    image: '/placeholder.svg',
    descKey: 'products.whiteTshirtDesc',
    description: 'Classic white crew neck t-shirt made from 100% cotton.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Gray'],
    category: 'mens',
    subCategory: 'tshirts-mens',
    isActive: true
  },
  {
    id: '2',
    nameKey: 'products.vintageTee',
    name: 'Vintage Graphic Tee',
    price: 29.99,
    image: '/placeholder.svg',
    descKey: 'products.vintageTeeDesc',
    description: 'Retro-style graphic t-shirt with vintage prints.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Navy'],
    category: 'mens',
    subCategory: 'tshirts-mens',
    isActive: true
  },
  {
    id: '3',
    nameKey: 'products.premiumTee',
    name: 'Premium Cotton Tee',
    price: 34.99,
    image: '/placeholder.svg',
    descKey: 'products.premiumTeeDesc',
    description: 'High-quality cotton t-shirt with superior comfort.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Gray', 'Navy'],
    category: 'mens',
    subCategory: 'tshirts-mens',
    isActive: true
  },
  // Men's Shirts
  {
    id: '4',
    nameKey: 'products.whiteDressShirt',
    name: 'Classic White Dress Shirt',
    price: 49.99,
    image: '/placeholder.svg',
    descKey: 'products.whiteDressShirtDesc',
    description: 'Professional white dress shirt for business wear.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Light Blue'],
    category: 'mens',
    subCategory: 'shirts-mens',
    isActive: true
  },
  {
    id: '5',
    nameKey: 'products.plaidShirt',
    name: 'Casual Plaid Shirt',
    price: 45.99,
    image: '/placeholder.svg',
    descKey: 'products.plaidShirtDesc',
    description: 'Comfortable plaid shirt for casual occasions.',
    sizes: ['M', 'L', 'XL'],
    colors: ['Red/Black', 'Blue/Green', 'Gray/Black'],
    category: 'mens',
    subCategory: 'shirts-mens',
    isActive: true
  },
  // Men's Jeans
  {
    id: '6',
    nameKey: 'products.blueJeans',
    name: 'Classic Blue Jeans',
    price: 59.99,
    image: '/placeholder.svg',
    descKey: 'products.blueJeansDesc',
    description: 'Traditional blue jeans with classic fit.',
    sizes: ['30', '32', '34', '36'],
    colors: ['Blue', 'Black', 'Gray'],
    category: 'mens',
    subCategory: 'jeans-mens',
    isActive: true
  },
  {
    id: '7',
    nameKey: 'products.slimJeans',
    name: 'Slim Fit Dark Jeans',
    price: 69.99,
    image: '/placeholder.svg',
    descKey: 'products.slimJeansDesc',
    description: 'Modern slim fit jeans in dark wash.',
    sizes: ['30', '32', '34', '36'],
    colors: ['Dark Blue', 'Black'],
    category: 'mens',
    subCategory: 'jeans-mens',
    isActive: true
  },
  // Men's Jackets
  {
    id: '8',
    nameKey: 'products.leatherJacket',
    name: 'Leather Bomber Jacket',
    price: 149.99,
    image: '/placeholder.svg',
    descKey: 'products.leatherJacketDesc',
    description: 'Stylish leather bomber jacket for cool weather.',
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'Brown'],
    category: 'mens',
    subCategory: 'jackets-mens',
    isActive: true
  },
  // Women's T-Shirts
  {
    id: '9',
    nameKey: 'products.cottonVneck',
    name: 'Soft Cotton V-Neck',
    price: 26.99,
    image: '/placeholder.svg',
    descKey: 'products.cottonVneckDesc',
    description: 'Comfortable cotton v-neck t-shirt for women.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Pink', 'White', 'Navy', 'Gray'],
    category: 'womens',
    subCategory: 'tshirts-womens',
    isActive: true
  },
  {
    id: '10',
    nameKey: 'products.floralTee',
    name: 'Floral Print Tee',
    price: 31.99,
    image: '/placeholder.svg',
    descKey: 'products.floralTeeDesc',
    description: 'Beautiful floral print t-shirt for casual wear.',
    sizes: ['S', 'M', 'L'],
    colors: ['Pink/Green', 'Blue/White', 'Purple/Yellow'],
    category: 'womens',
    subCategory: 'tshirts-womens',
    isActive: true
  },
  // Women's Shirts/Blouses
  {
    id: '11',
    nameKey: 'products.silkBlouse',
    name: 'Silk Blouse',
    price: 79.99,
    image: '/placeholder.svg',
    descKey: 'products.silkBlouseDesc',
    description: 'Elegant silk blouse perfect for professional settings.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White', 'Cream', 'Light Pink'],
    category: 'womens',
    subCategory: 'blouses-womens',
    isActive: true
  },
  // Kids T-Shirts
  {
    id: '12',
    nameKey: 'products.animalTee',
    name: 'Fun Animal Print Tee',
    price: 19.99,
    image: '/placeholder.svg',
    descKey: 'products.animalTeeDesc',
    description: 'Colorful animal print t-shirt for kids.',
    sizes: ['2T', '3T', '4T', '5T'],
    colors: ['Multi-Color', 'Blue', 'Pink'],
    category: 'kids',
    subCategory: 'tshirts-kids',
    isActive: true
  }
];

// Helper to generate a unique ID
const generateUniqueId = (prefix: string, merchantId: string) => `${prefix}_${merchantId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

interface ProductDataContextType {
  // Data
  categories: MerchantCategory[];
  subCategories: MerchantSubCategory[];
  products: MerchantProduct[];
  
  // Merchant management
  initializeMerchantData: (merchantId: string) => void;
  
  // Category management
  addCategory: (category: Omit<MerchantCategory, 'id'>) => void;
  updateCategory: (id: string, category: Partial<MerchantCategory>) => void;
  deleteCategory: (id: string) => void;
  
  // SubCategory management
  addSubCategory: (subCategory: Omit<MerchantSubCategory, 'id'>) => void;
  updateSubCategory: (id: string, subCategory: Partial<MerchantSubCategory>) => void;
  deleteSubCategory: (id: string) => void;
  
  // Product management
  addProduct: (product: Omit<MerchantProduct, 'id'>) => void;
  updateProduct: (id: string, product: Partial<MerchantProduct>) => void;
  deleteProduct: (id: string) => void;
  
  // Getters for customer-facing components
  getActiveCategories: () => MerchantCategory[];
  getActiveSubCategories: (categoryId: string) => MerchantSubCategory[];
  getActiveProducts: (categoryId: string, subCategoryId?: string) => MerchantProduct[];
}

const ProductDataContext = createContext<ProductDataContextType | undefined>(undefined);

export const ProductDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<MerchantCategory[]>(DEFAULT_CATEGORIES);
  const [subCategories, setSubCategories] = useState<MerchantSubCategory[]>(DEFAULT_SUBCATEGORIES);
  const [products, setProducts] = useState<MerchantProduct[]>(DEFAULT_PRODUCTS);
  const [currentMerchantId, setCurrentMerchantId] = useState<string | null>(null);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (currentMerchantId) {
      saveMerchantData(currentMerchantId, { categories, subCategories, products });
    }
  }, [categories, subCategories, products, currentMerchantId]);

  // Initialize merchant data (called when merchant logs in)
  const initializeMerchantData = useCallback((merchantId: string) => {
    setCurrentMerchantId(merchantId);
    // Try to load existing data for this merchant
    const merchantData = loadMerchantData(merchantId);
    if (merchantData) {
      // Load existing data
      setCategories(merchantData.categories || DEFAULT_CATEGORIES);
      setSubCategories(merchantData.subCategories || DEFAULT_SUBCATEGORIES);
      setProducts(merchantData.products || DEFAULT_PRODUCTS);
    } else {
      // Generate unique IDs for categories
      const categoryIdMap: Record<string, string> = {};
      const categories = DEFAULT_CATEGORIES.map(cat => {
        const uniqueId = generateUniqueId('cat', merchantId);
        categoryIdMap[cat.id] = uniqueId;
        return { ...cat, id: uniqueId, merchantId };
      });
      // Generate unique IDs for subcategories and link to categories
      const subCategoryIdMap: Record<string, string> = {};
      const subCategories = DEFAULT_SUBCATEGORIES.map(sub => {
        const uniqueId = generateUniqueId('sub', merchantId);
        subCategoryIdMap[sub.id] = uniqueId;
        // Map all categoryIds to new unique IDs
        const newCategoryIds = sub.categoryIds.map(cid => categoryIdMap[cid] || cid);
        return { ...sub, id: uniqueId, categoryIds: newCategoryIds, merchantId };
      });
      // Generate unique IDs for products and link to new category/subcategory IDs
      const products = DEFAULT_PRODUCTS.map(prod => {
        return {
          ...prod,
          id: generateUniqueId('prod', merchantId),
          category: categoryIdMap[prod.category] || prod.category,
          subCategory: subCategoryIdMap[prod.subCategory] || prod.subCategory,
          merchantId
        };
      });
      setCategories(categories);
      setSubCategories(subCategories);
      setProducts(products);
    }
  }, []);

  // Function to rehydrate context state from cookies (for customer UI)
  const rehydrateFromCookies = () => {
    const allData = Storage.get<Record<string, MerchantDataStructure>>(STORAGE_KEY);
    // For MVP, just use the first merchant's data if present
    if (allData) {
      const firstMerchantData = Object.values(allData)[0];
      if (firstMerchantData) {
        setCategories(firstMerchantData.categories || DEFAULT_CATEGORIES);
        setSubCategories(firstMerchantData.subCategories || DEFAULT_SUBCATEGORIES);
        setProducts(firstMerchantData.products || DEFAULT_PRODUCTS);
      }
    }
  };

  // Category management
  const addCategory = (category: Omit<MerchantCategory, 'id'>) => {
    const newCategory: MerchantCategory = {
      ...category,
      id: Date.now().toString(),
      merchantId: currentMerchantId || undefined
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<MerchantCategory>) => {
    setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, ...updates } : cat));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    // Also remove related subcategories and products
    setSubCategories(prev => prev.filter(sub => !sub.categoryIds.includes(id)));
    setProducts(prev => prev.filter(prod => prod.category !== id));
  };

  // SubCategory management
  const addSubCategory = (subCategory: Omit<MerchantSubCategory, 'id'>) => {
    const newSubCategory: MerchantSubCategory = {
      ...subCategory,
      id: Date.now().toString(),
      merchantId: currentMerchantId || undefined
    };
    setSubCategories(prev => [...prev, newSubCategory]);
  };

  const updateSubCategory = (id: string, updates: Partial<MerchantSubCategory>) => {
    setSubCategories(prev => prev.map(sub => {
      if (sub.id === id) {
        // Always create a new array for categoryIds if present
        const updated = { ...sub, ...updates };
        if (updates.categoryIds) {
          updated.categoryIds = [...updates.categoryIds];
        }
        return updated;
      }
      return sub;
    }));
  };

  const deleteSubCategory = (id: string) => {
    setSubCategories(prev => prev.filter(sub => sub.id !== id));
    // Also remove related products
    setProducts(prev => prev.filter(prod => prod.subCategory !== id));
  };

  // Product management
  const addProduct = (product: Omit<MerchantProduct, 'id'>) => {
    const newProduct: MerchantProduct = {
      ...product,
      id: Date.now().toString(),
      merchantId: currentMerchantId || undefined
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<MerchantProduct>) => {
    setProducts(prev => prev.map(prod => prod.id === id ? { ...prod, ...updates } : prod));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(prod => prod.id !== id));
  };

  // Getters for customer-facing components
  const getActiveCategories = () => {
    return categories.filter(cat => cat.isActive);
  };

  const getActiveSubCategories = (categoryId: string) => {
    return subCategories.filter(sub => sub.categoryIds.includes(categoryId) && sub.isActive);
  };

  const getActiveProducts = (categoryId: string, subCategoryId?: string) => {
    return products.filter(prod => 
      prod.category === categoryId && 
      (!subCategoryId || prod.subCategory === subCategoryId) &&
      prod.isActive
    );
  };

  const value: ProductDataContextType & { rehydrateFromCookies: () => void } = {
    ...{
      categories,
      subCategories,
      products,
      initializeMerchantData,
      addCategory,
      updateCategory,
      deleteCategory,
      addSubCategory,
      updateSubCategory,
      deleteSubCategory,
      addProduct,
      updateProduct,
      deleteProduct,
      getActiveCategories,
      getActiveSubCategories,
      getActiveProducts
    },
    rehydrateFromCookies
  };

  return (
    <ProductDataContext.Provider value={value}>
      {children}
    </ProductDataContext.Provider>
  );
};

export const useProductData = () => {
  const context = useContext(ProductDataContext);
  if (context === undefined) {
    throw new Error('useProductData must be used within a ProductDataProvider');
  }
  return context;
};
