import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/pages/Index';
import { VoiceIndicator } from './VoiceIndicator';
import { useLanguage } from '@/hooks/useLanguage';
import { useProductData } from '@/contexts/ProductDataContext';
import { formatCurrencyForLanguage } from '@/lib/translationHelpers';

interface ProductListScreenProps {
  category: string;
  subCategory: string;
  onProductSelect: (product: Product) => void;
  onBack: () => void;
}

export const ProductListScreen = ({ category, subCategory, onProductSelect, onBack }: ProductListScreenProps) => {
  const { t, language } = useLanguage();
  const { getActiveProducts, getActiveCategories, getActiveSubCategories } = useProductData();

  // Get dynamic data from context
  const products = getActiveProducts(category, subCategory);
  const categories = getActiveCategories();
  const subCategories = getActiveSubCategories(category);
  
  // Get titles for display
  const categoryData = categories.find(cat => cat.id === category);
  const subCategoryData = subCategories.find(sub => sub.id === subCategory);
  
  const categoryTitle = categoryData ? t(categoryData.nameKey) : category;
  const subCategoryTitle = subCategoryData ? t(subCategoryData.nameKey) : subCategory;

  const formatPrice = (price: number) => {
    return formatCurrencyForLanguage(price, language as 'en' | 'ar');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Breadcrumbs */}
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <button 
            onClick={() => {/* Navigate to home */}}
            className="hover:text-purple-600 transition-colors"
          >
            {t('nav.home')}
          </button>
          <span>{'>'}</span>
          <button 
            onClick={onBack}
            className="hover:text-purple-600 transition-colors"
          >
            {categoryTitle}
          </button>
          <span>{'>'}</span>
          <span className="text-foreground font-medium">{subCategoryTitle}</span>
        </nav>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {categoryTitle} - {subCategoryTitle}
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
      <VoiceIndicator message={t('voice.productsPrompt')} />

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => onProductSelect(product)}
              className="group bg-card rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Product Image */}
              <div className="aspect-square bg-gradient-to-br from-muted to-muted/70 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Quick Add Button (hidden by default, shown on hover) */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-card text-foreground px-4 py-2 rounded-full font-medium hover:bg-muted transition-colors">
                    {t('ui.quickView')}
                  </button>
                </div>
              </div>
              
              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-purple-600 transition-colors">
                  {product.nameKey ? t(product.nameKey) : product.name}
                </h3>
                <p className="text-lg font-bold text-foreground">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {product.sizes.length} {t('product.sizesAvailable')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-card rounded-xl shadow-md p-8">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t('ui.noProductsFound')}
            </h3>
            <p className="text-muted-foreground">
              {t('ui.workingOnProducts')}
            </p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex justify-center items-center space-x-4">
          <button className="flex items-center px-4 py-2 text-muted-foreground hover:text-purple-600 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t('ui.previousPage')}
          </button>
          
          <span className="text-muted-foreground">{t('ui.pageOf').replace('{current}', '1').replace('{total}', '1')}</span>
          
          <button className="flex items-center px-4 py-2 text-muted-foreground hover:text-purple-600 transition-colors">
            {t('ui.nextPage')}
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};
