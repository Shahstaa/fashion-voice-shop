import { ArrowLeft } from 'lucide-react';
import { VoiceIndicator } from './VoiceIndicator';
import { useLanguage } from '@/hooks/useLanguage';
import { useProductData } from '@/contexts/ProductDataContext';
import { getIcon } from '@/lib/iconMap';

interface SubCategoriesScreenProps {
  category: string;
  onSubCategorySelect: (subCategory: string) => void;
  onBack: () => void;
}

export const SubCategoriesScreen = ({ category, onSubCategorySelect, onBack }: SubCategoriesScreenProps) => {
  const { t } = useLanguage();
  const { getActiveSubCategories, getActiveCategories } = useProductData();

  const categorySubCategories = getActiveSubCategories(category);
  
  // Get category title for display
  const categories = getActiveCategories();
  const categoryData = categories.find(cat => cat.id === category);
  const categoryTitle = categoryData ? t(categoryData.nameKey) : category;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <button 
            onClick={onBack}
            className="hover:text-purple-600 transition-colors"
          >
            {t('nav.home')}
          </button>
          <span>{'>'}</span>
          <span className="text-foreground font-medium">{categoryTitle}</span>
        </nav>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {categoryTitle}
          </h1>
          <button
            onClick={onBack}
            className="flex items-center text-muted-foreground hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('nav.back')}
          </button>
        </div>
      </div>
      {/* Voice Prompt */}
      <VoiceIndicator message={t('voice.categoriesPrompt')} />
      {/* Sub-Categories Grid */}
      {categorySubCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorySubCategories.map((subCategory) => {
            const IconComponent = getIcon(subCategory.icon);
            return (
              <button
                key={subCategory.id}
                onClick={() => onSubCategorySelect(subCategory.id)}
                className="group relative overflow-hidden bg-card rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-8 text-left"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${subCategory.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${subCategory.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-foreground transition-colors">
                  {t(subCategory.nameKey)}
                </h3>
                <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                  {t(subCategory.descKey)}
                </p>
                {/* Hover Arrow */}
                <div className="absolute top-4 right-4 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-card shadow-md flex items-center justify-center">
                    <span className="text-muted-foreground">→</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-card rounded-xl shadow-md p-8">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Coming Soon
            </h3>
            <p className="text-muted-foreground">
              We're working on subcategories for {categoryTitle}
            </p>
          </div>
        </div>
      )}
      {/* Footer Message */}
      <div className="text-center mt-12">
        <p className="text-muted-foreground text-sm">
          {t('voice.helpPrompt')}
        </p>
      </div>
    </div>
  );
};
