import { useState } from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { Product, CartItem } from '@/pages/Index';
import { useLanguage } from '@/hooks/useLanguage';
import { formatCurrencyForLanguage } from '@/lib/translationHelpers';

interface ProductDetailScreenProps {
  product: Product | null;
  onAddToCart: (item: CartItem) => void;
  onBack: () => void;
}

export const ProductDetailScreen = ({ product, onAddToCart, onBack }: ProductDetailScreenProps) => {
  const { t, language } = useLanguage();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">{t('product.productNotFound')}</h2>
          <button onClick={onBack} className="mt-4 text-primary hover:text-primary/80">
            {t('product.goBack')}
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert(t('product.selectSizeColor'));
      return;
    }

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      image: product.image
    };

    onAddToCart(cartItem);
    alert(t('product.addedToCart'));
  };

  const categoryTitles: Record<string, string> = {
    mens: t('categories.mensApparel'),
    womens: t('categories.womensApparel'),
    kids: t('categories.kidsClothing'),
    footwear: t('categories.footwear'),
    accessories: t('categories.accessories'),
    sale: t('categories.sale')
  };

  const subCategoryTitles: Record<string, string> = {
    tshirts: t('subcategories.tshirts'),
    shirts: language === 'ar' && product.category === 'womens' ? t('subcategories.blouses') : t('subcategories.shirts'),
    jeans: t('subcategories.jeans'),
    jackets: t('subcategories.jackets')
  };

  const categoryTitle = categoryTitles[product.category] || product.category;
  const subCategoryTitle = subCategoryTitles[product.subCategory] || product.subCategory;

  const formatPrice = (price: number) => {
    return formatCurrencyForLanguage(price, language as 'en' | 'ar');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Breadcrumbs */}
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <button className="hover:text-purple-600 transition-colors">
            {t('nav.home')}
          </button>
          <span>{'>'}</span>
          <button className="hover:text-purple-600 transition-colors">
            {categoryTitle}
          </button>
          <span>{'>'}</span>
          <button 
            onClick={onBack}
            className="hover:text-purple-600 transition-colors"
          >
            {subCategoryTitle}
          </button>
          <span>{'>'}</span>
          <span className="text-foreground font-medium">{product.nameKey ? t(product.nameKey) : product.name}</span>
        </nav>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {product.nameKey ? t(product.nameKey) : product.name}
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
      <div className="mb-8 text-center">
        <div className="inline-flex items-center bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border transition-colors">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-sm text-muted-foreground">
            {t('voice.productDetailPrompt')}
          </span>
        </div>
      </div>
      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gradient-to-br from-muted to-muted/70 rounded-xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all">
                <img
                  src={product.image}
                  alt={`${product.name} view ${i + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{product.nameKey ? t(product.nameKey) : product.name}</h2>
            <p className="text-3xl font-bold text-purple-600">{formatPrice(product.price)}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{t('product.description')}</h3>
            <p className="text-muted-foreground leading-relaxed">{product.descKey ? t(product.descKey) : product.description}</p>
          </div>
          {/* Size Selection */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">{t('product.size')}</h3>
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 px-4 border rounded-lg font-medium transition-all ${
                    selectedSize === size
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-muted text-foreground hover:border-purple-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          {/* Color Selection */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">{t('product.color')}</h3>
            <div className="flex space-x-2 flex-wrap">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`py-2 px-4 border rounded-lg font-medium transition-all mb-2 ${
                    selectedColor === color
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-muted text-foreground hover:border-purple-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
          {/* Quantity Selection */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">{t('cart.quantity')}</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || !selectedColor}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-muted disabled:to-muted text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed transition-all duration-200"
          >
            {t('product.addToCart')} - {formatPrice(product.price * quantity)}
          </button>
          {/* Product Features */}
          <div className="bg-muted rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">{t('product.features')}</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>{t('product.premiumMaterials')}</li>
              <li>{t('product.comfortableFit')}</li>
              <li>{t('product.easyCare')}</li>
              <li>{t('product.freeShipping')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
