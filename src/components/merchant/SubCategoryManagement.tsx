import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useProductData, MerchantSubCategory } from '@/contexts/ProductDataContext';
import { generateTranslationKey, addDynamicTranslation } from '@/lib/translationHelpers';

export const SubCategoryManagement = () => {
  const { t, language, reloadTranslations } = useLanguage();
  const { categories, subCategories, addSubCategory, updateSubCategory, deleteSubCategory } = useProductData();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<string | null>(null);
  const [newSubCategory, setNewSubCategory] = useState({
    nameEn: '',
    nameAr: '',
    descEn: '',
    descAr: '',
    icon: 'Package',
    gradient: 'from-blue-500 to-blue-600',
    categoryIds: [] as string[]
  });

  const resetForm = () => {
    setNewSubCategory({ 
      nameEn: '', 
      nameAr: '', 
      descEn: '', 
      descAr: '', 
      icon: 'Package', 
      gradient: 'from-blue-500 to-blue-600',
      categoryIds: []
    });
    setEditingSubCategory(null);
  };

  const handleAddSubCategory = () => {
    if (!newSubCategory.nameEn.trim() || newSubCategory.categoryIds.length === 0) return;
    
    // Generate translation keys
    const nameKey = generateTranslationKey('subcategories', newSubCategory.nameEn);
    const descKey = generateTranslationKey('subcategories', newSubCategory.nameEn + '_desc');
    
    // Add dynamic translations
    addDynamicTranslation(nameKey, newSubCategory.nameEn, newSubCategory.nameAr || newSubCategory.nameEn);
    addDynamicTranslation(descKey, newSubCategory.descEn, newSubCategory.descAr || newSubCategory.descEn);
    
    // Reload translations in the context
    reloadTranslations();
    
    addSubCategory({
      nameKey,
      descKey,
      icon: newSubCategory.icon,
      gradient: newSubCategory.gradient,
      categoryIds: newSubCategory.categoryIds,
      isActive: true
    });
    
    resetForm();
    setShowAddForm(false);
  };

  const handleEditSubCategory = (subCategory: MerchantSubCategory) => {
    // For editing, get the current English and Arabic values from translations
    setNewSubCategory({
      nameEn: t(subCategory.nameKey, { lng: 'en' }) || '',
      nameAr: t(subCategory.nameKey, { lng: 'ar' }) || '',
      descEn: t(subCategory.descKey, { lng: 'en' }) || '',
      descAr: t(subCategory.descKey, { lng: 'ar' }) || '',
      icon: subCategory.icon,
      gradient: subCategory.gradient,
      categoryIds: subCategory.categoryIds || []
    });
    setEditingSubCategory(subCategory.id);
    setShowAddForm(true);
  };

  const handleUpdateSubCategory = () => {
    if (!editingSubCategory || !newSubCategory.nameEn.trim()) return;
    
    const existingSubCategory = subCategories.find(sc => sc.id === editingSubCategory);
    if (!existingSubCategory) return;
    
    // Update dynamic translations
    addDynamicTranslation(existingSubCategory.nameKey, newSubCategory.nameEn, newSubCategory.nameAr || newSubCategory.nameEn);
    addDynamicTranslation(existingSubCategory.descKey, newSubCategory.descEn, newSubCategory.descAr || newSubCategory.descEn);
    
    // Reload translations
    reloadTranslations();
    
    updateSubCategory(editingSubCategory, {
      icon: newSubCategory.icon,
      gradient: newSubCategory.gradient,
      categoryIds: newSubCategory.categoryIds
    });
    
    resetForm();
    setShowAddForm(false);
  };

  const handleCancelEdit = () => {
    resetForm();
    setShowAddForm(false);
  };

  const handleDeleteSubCategory = (id: string) => {
    deleteSubCategory(id);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">
          {t('merchant.subcategories.title')}
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>{t('merchant.subcategories.addNew')}</span>
        </button>
      </div>

      {/* Add/Edit SubCategory Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            {editingSubCategory ? 'Edit Subcategory' : t('merchant.subcategories.addNew')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Subcategory Name (English)
              </label>
              <input
                type="text"
                value={newSubCategory.nameEn}
                onChange={(e) => setNewSubCategory({...newSubCategory, nameEn: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter subcategory name in English"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                اسم الفئة الفرعية (عربي)
              </label>
              <input
                type="text"
                value={newSubCategory.nameAr}
                onChange={(e) => setNewSubCategory({...newSubCategory, nameAr: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-arabic"
                placeholder="أدخل اسم الفئة الفرعية بالعربية"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description (English)
              </label>
              <input
                type="text"
                value={newSubCategory.descEn}
                onChange={(e) => setNewSubCategory({...newSubCategory, descEn: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter description in English"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                الوصف (عربي)
              </label>
              <input
                type="text"
                value={newSubCategory.descAr}
                onChange={(e) => setNewSubCategory({...newSubCategory, descAr: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-arabic"
                placeholder="أدخل الوصف بالعربية"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Parent Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newSubCategory.categoryIds.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewSubCategory({
                            ...newSubCategory,
                            categoryIds: [...newSubCategory.categoryIds, category.id]
                          });
                        } else {
                          setNewSubCategory({
                            ...newSubCategory,
                            categoryIds: newSubCategory.categoryIds.filter(id => id !== category.id)
                          });
                        }
                      }}
                    />
                    <span>{t(category.nameKey)}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Icon Name
              </label>
              <input
                type="text"
                value={newSubCategory.icon}
                onChange={(e) => setNewSubCategory({...newSubCategory, icon: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Package, Shirt, Smartphone"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gradient Classes
              </label>
              <input
                type="text"
                value={newSubCategory.gradient}
                onChange={(e) => setNewSubCategory({...newSubCategory, gradient: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              onClick={editingSubCategory ? handleUpdateSubCategory : handleAddSubCategory}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              {editingSubCategory ? 'Update Subcategory' : 'Add Subcategory'}
            </button>
          </div>
        </div>
      )}

      {/* SubCategories List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">
                  {t('merchant.subcategories.name')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">
                  {t('merchant.subcategories.description')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">
                  Parent Categories
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-700">
                  {t('merchant.subcategories.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {subCategories.map((subCategory) => {
                return (
                  <tr key={subCategory.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">
                        {t(subCategory.nameKey)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-600">
                        {t(subCategory.descKey)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-600">
                        {subCategory.categoryIds && subCategory.categoryIds.length > 0
                          ? subCategory.categoryIds.map(cid => {
                              const cat = categories.find(c => c.id === cid);
                              return cat ? t(cat.nameKey) : 'Unknown';
                            }).join(', ')
                          : 'None'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditSubCategory(subCategory)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteSubCategory(subCategory.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
