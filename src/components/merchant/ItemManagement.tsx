import { useState } from 'react';
import { Plus, Edit, Trash2, Image } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useProductData, MerchantProduct } from '@/contexts/ProductDataContext';
import { generateTranslationKey, addDynamicTranslation, formatCurrencyForLanguage } from '@/lib/translationHelpers';

export const ItemManagement = () => {
  const { t, language, reloadTranslations } = useLanguage();
  const { categories, subCategories, products, addProduct, updateProduct, deleteProduct, getActiveSubCategories } = useProductData();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    nameEn: '',
    nameAr: '',
    descEn: '',
    descAr: '',
    price: 0,
    image: '/placeholder.svg',
    sizes: ['M'],
    colors: ['#000000'],
    category: '',
    subCategory: ''
  });

  const resetForm = () => {
    setNewProduct({ 
      nameEn: '', 
      nameAr: '', 
      descEn: '', 
      descAr: '', 
      price: 0, 
      image: '/placeholder.svg',
      sizes: ['M'],
      colors: ['#000000'],
      category: '',
      subCategory: ''
    });
    setEditingProduct(null);
  };

  const handleAddProduct = () => {
    if (!newProduct.nameEn.trim() || !newProduct.category || !newProduct.subCategory) return;
    
    // Generate translation keys
    const nameKey = generateTranslationKey('products', newProduct.nameEn);
    const descKey = generateTranslationKey('products', newProduct.nameEn + '_desc');
    
    // Add dynamic translations
    addDynamicTranslation(nameKey, newProduct.nameEn, newProduct.nameAr || newProduct.nameEn);
    addDynamicTranslation(descKey, newProduct.descEn, newProduct.descAr || newProduct.descEn);
    
    // Reload translations
    reloadTranslations();
    
    // Create the product with the translated name and description for backward compatibility
    addProduct({
      nameKey,
      name: newProduct.nameEn, // Keep the English name as fallback
      descKey,
      description: newProduct.descEn, // Keep the English description as fallback
      price: newProduct.price,
      image: newProduct.image,
      sizes: newProduct.sizes,
      colors: newProduct.colors,
      category: newProduct.category,
      subCategory: newProduct.subCategory,
      isActive: true
    });
    
    resetForm();
    setShowAddForm(false);
  };

  const handleEditProduct = (product: MerchantProduct) => {
    setNewProduct({
      nameEn: t(product.nameKey, { lng: 'en' }) || product.name,
      nameAr: t(product.nameKey, { lng: 'ar' }) || product.name,
      descEn: t(product.descKey, { lng: 'en' }) || product.description,
      descAr: t(product.descKey, { lng: 'ar' }) || product.description,
      price: product.price,
      image: product.image,
      sizes: product.sizes,
      colors: product.colors,
      category: product.category,
      subCategory: product.subCategory
    });
    setEditingProduct(product.id);
    setShowAddForm(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct || !newProduct.nameEn.trim()) return;
    
    const existingProduct = products.find(p => p.id === editingProduct);
    if (!existingProduct) return;
    
    // Update dynamic translations
    addDynamicTranslation(existingProduct.nameKey, newProduct.nameEn, newProduct.nameAr || newProduct.nameEn);
    addDynamicTranslation(existingProduct.descKey, newProduct.descEn, newProduct.descAr || newProduct.descEn);
    
    // Reload translations
    reloadTranslations();
    
    updateProduct(editingProduct, {
      price: newProduct.price,
      image: newProduct.image,
      sizes: newProduct.sizes,
      colors: newProduct.colors,
      category: newProduct.category,
      subCategory: newProduct.subCategory
    });
    
    resetForm();
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    resetForm();
    setShowAddForm(false);
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
  };

  const formatPrice = (product: { price: number }) => {
    return formatCurrencyForLanguage(product.price, language as 'en' | 'ar');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">
          {t('merchant.products.title')}
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>{t('merchant.products.addNew')}</span>
        </button>
      </div>

      {/* Add/Edit Product Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            {editingProduct ? 'Edit Product' : t('merchant.products.addNew')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Product Name (English)
              </label>
              <input
                type="text"
                value={newProduct.nameEn}
                onChange={(e) => setNewProduct({...newProduct, nameEn: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter product name in English"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                اسم المنتج (عربي)
              </label>
              <input
                type="text"
                value={newProduct.nameAr}
                onChange={(e) => setNewProduct({...newProduct, nameAr: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-arabic"
                placeholder="أدخل اسم المنتج بالعربية"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description (English)
              </label>
              <input
                type="text"
                value={newProduct.descEn}
                onChange={(e) => setNewProduct({...newProduct, descEn: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter product description in English"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                الوصف (عربي)
              </label>
              <input
                type="text"
                value={newProduct.descAr}
                onChange={(e) => setNewProduct({...newProduct, descAr: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-arabic"
                placeholder="أدخل وصف المنتج بالعربية"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price (USD)
              </label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value, subCategory: ''})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {t(category.nameKey)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Subcategory
              </label>
              <select
                value={newProduct.subCategory}
                onChange={(e) => setNewProduct({...newProduct, subCategory: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={!newProduct.category}
              >
                <option value="">Select Subcategory</option>
                {getActiveSubCategories(newProduct.category).map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {t(subCategory.nameKey)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={handleCancelEdit}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <Image className="w-16 h-16 text-slate-400" />
            </div>
            <div className="p-6">
              <h3 className="font-bold text-slate-800 mb-2 truncate">
                {t(product.nameKey)}
              </h3>
              <p className="text-sm text-slate-600 mb-1">
                {categories.find(c => c.id === product.category) ? t(categories.find(c => c.id === product.category)!.nameKey) : product.category}
              </p>
              <p className="text-xs text-slate-500 mb-2">
                {subCategories.find(sc => sc.id === product.subCategory) ? t(subCategories.find(sc => sc.id === product.subCategory)!.nameKey) : product.subCategory}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-purple-600">
                  {formatPrice(product)}
                </span>
                <span className="text-sm text-slate-600">
                  Available
                </span>
              </div>
              <div className="flex justify-between">
                <button 
                  onClick={() => handleEditProduct(product)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
