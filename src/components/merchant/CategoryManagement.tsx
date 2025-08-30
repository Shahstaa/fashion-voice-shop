
import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useProductData, MerchantCategory } from '@/contexts/ProductDataContext';
import { generateTranslationKey, addDynamicTranslation } from '@/lib/translationHelpers';

export const CategoryManagement = () => {
  const { t, language, reloadTranslations } = useLanguage();
  const { categories, addCategory, updateCategory, deleteCategory } = useProductData();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    nameEn: '',
    nameAr: '',
    descEn: '',
    descAr: '',
    icon: 'Package',
    gradient: 'from-purple-500 to-pink-500'
  });

  const resetForm = () => {
    setNewCategory({ 
      nameEn: '', 
      nameAr: '', 
      descEn: '', 
      descAr: '', 
      icon: 'Package', 
      gradient: 'from-purple-500 to-pink-500' 
    });
    setEditingCategory(null);
  };

  const handleAddCategory = () => {
    if (!newCategory.nameEn.trim()) return;
    
    // Generate translation keys
    const nameKey = generateTranslationKey('categories', newCategory.nameEn);
    const descKey = generateTranslationKey('categories', newCategory.nameEn + '_desc');
    
    // Add dynamic translations
    addDynamicTranslation(nameKey, newCategory.nameEn, newCategory.nameAr || newCategory.nameEn);
    addDynamicTranslation(descKey, newCategory.descEn, newCategory.descAr || newCategory.descEn);
    
    // Reload translations in the context
    reloadTranslations();
    
    addCategory({
      nameKey,
      descKey,
      icon: newCategory.icon,
      gradient: newCategory.gradient,
      isActive: true
    });
    
    resetForm();
    setShowAddForm(false);
  };

  const handleEditCategory = (category: MerchantCategory) => {
    // For editing, we need to get the current English and Arabic values
    // This is a simplified approach - in a real app, you'd store the original values
    setNewCategory({
      nameEn: t(category.nameKey, { lng: 'en' }) || '',
      nameAr: t(category.nameKey, { lng: 'ar' }) || '',
      descEn: t(category.descKey, { lng: 'en' }) || '',
      descAr: t(category.descKey, { lng: 'ar' }) || '',
      icon: category.icon,
      gradient: category.gradient
    });
    setEditingCategory(category.id);
    setShowAddForm(true);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !newCategory.nameEn.trim()) return;
    
    const existingCategory = categories.find(c => c.id === editingCategory);
    if (!existingCategory) return;
    
    // Update dynamic translations
    addDynamicTranslation(existingCategory.nameKey, newCategory.nameEn, newCategory.nameAr || newCategory.nameEn);
    addDynamicTranslation(existingCategory.descKey, newCategory.descEn, newCategory.descAr || newCategory.descEn);
    
    // Reload translations
    reloadTranslations();
    
    updateCategory(editingCategory, {
      icon: newCategory.icon,
      gradient: newCategory.gradient
    });
    
    resetForm();
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    resetForm();
    setShowAddForm(false);
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">
          {t('merchant.categories.title')}
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>{t('merchant.categories.addNew')}</span>
        </button>
      </div>

      {/* Add/Edit Category Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            {editingCategory ? 'Edit Category' : t('merchant.categories.addNew')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category Name (English)
              </label>
              <input
                type="text"
                value={newCategory.nameEn}
                onChange={(e) => setNewCategory({...newCategory, nameEn: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter category name in English"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                اسم الفئة (عربي)
              </label>
              <input
                type="text"
                value={newCategory.nameAr}
                onChange={(e) => setNewCategory({...newCategory, nameAr: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-arabic"
                placeholder="أدخل اسم الفئة بالعربية"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description (English)
              </label>
              <input
                type="text"
                value={newCategory.descEn}
                onChange={(e) => setNewCategory({...newCategory, descEn: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter description in English"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                الوصف (عربي)
              </label>
              <input
                type="text"
                value={newCategory.descAr}
                onChange={(e) => setNewCategory({...newCategory, descAr: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-arabic"
                placeholder="أدخل الوصف بالعربية"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Icon Name
              </label>
              <input
                type="text"
                value={newCategory.icon}
                onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Package, Shirt, Smartphone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gradient Classes
              </label>
              <input
                type="text"
                value={newCategory.gradient}
                onChange={(e) => setNewCategory({...newCategory, gradient: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., from-blue-500 to-blue-600"
              />
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
              onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              {editingCategory ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">
                  {t('merchant.categories.name')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">
                  {t('merchant.categories.description')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">
                  {t('merchant.categories.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">
                      {t(category.nameKey)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-600">
                      {t(category.descKey)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditCategory(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
