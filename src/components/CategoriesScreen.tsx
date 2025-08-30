import { VoiceIndicator } from './VoiceIndicator';
import { useLanguage } from '@/hooks/useLanguage';
import { useProductData } from '@/contexts/ProductDataContext';
import { getIcon } from '@/lib/iconMap';

interface CategoriesScreenProps {
  onCategorySelect: (category: string) => void;
}

export const CategoriesScreen = ({ onCategorySelect }: CategoriesScreenProps) => {
  const { t } = useLanguage();
  const { getActiveCategories } = useProductData();
  
  const categories = getActiveCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          {t('ui.exploreCollections')}
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          {t('ui.chooseCategoryPrompt')}
        </p>
      </div>

      {/* Voice Prompt */}
      <VoiceIndicator message={t('voice.categoriesPrompt')} />

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const IconComponent = getIcon(category.icon);
          return (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className="group relative overflow-hidden bg-card rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-8 text-left"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${category.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-foreground transition-colors">
                {t(category.nameKey)}
              </h3>
              <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                {t(category.descKey)}
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

      {/* Footer Message */}
      <div className="text-center mt-12">
        <p className="text-muted-foreground text-sm">
          {t('voice.helpPrompt')}
        </p>
      </div>
    </div>
  );
};
