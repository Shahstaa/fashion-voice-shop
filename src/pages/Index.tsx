import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { CategoriesScreen } from '@/components/CategoriesScreen';
import { SubCategoriesScreen } from '@/components/SubCategoriesScreen';
import { ProductListScreen } from '@/components/ProductListScreen';
import { ProductDetailScreen } from '@/components/ProductDetailScreen';
import { ShoppingCartScreen } from '@/components/ShoppingCartScreen';
import { PersistentCartSidebar } from '@/components/PersistentCartSidebar';
import { VoiceUI } from '@/components/VoiceUI';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ShoppingCart, Menu, Sun, Moon, Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useVoice } from '@/hooks/useVoice';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState as useReactState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

export interface Product {
  id: string;
  nameKey?: string; // For products with dynamic translations
  name: string; // Fallback for products without translation keys
  price: number;
  image: string;
  descKey?: string; // For products with dynamic translations
  description: string; // Fallback for products without translation keys
  sizes: string[];
  colors: string[];
  category: string;
  subCategory: string;
}

const Index = () => {
  const { t, isRTL } = useLanguage();
  const { isVoiceActive, stopVoice } = useVoice();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartExpanded, setIsCartExpanded] = useState(false);
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useReactState(false);
  const { language, setLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  // Determine current screen from URL
  const getCurrentScreenFromURL = () => {
    const path = location.pathname;
    
    if (path === '/') return 'welcome';
    if (path === '/categories') return 'categories';
    if (path === '/cart') return 'cart';
    if (path.startsWith('/product/')) return 'product-detail';
    if (path.match(/^\/categories\/[^/]+\/[^/]+$/)) return 'products';
    if (path.match(/^\/categories\/[^/]+$/)) return 'subcategories';
    
    return 'welcome';
  };

  const currentScreen = getCurrentScreenFromURL();
  const selectedCategory = params.category || '';
  const selectedSubCategory = params.subcategory || '';

  // Navigation functions that update URL
  const navigateToWelcome = () => navigate('/');
  const navigateToCategories = () => navigate('/categories');
  const navigateToSubCategories = (category: string) => navigate(`/categories/${category}`);
  const navigateToProducts = (category: string, subCategory: string) => navigate(`/categories/${category}/${subCategory}`);
  const navigateToProductDetail = (category: string, subCategory: string, productId: string, product: Product) => {
    setSelectedProduct(product);
    navigate(`/product/${category}/${subCategory}/${productId}`);
  };
  const navigateToCart = () => navigate('/cart');

  // Handle back navigation
  const handleBack = () => {
    if (currentScreen === 'product-detail') {
      navigateToProducts(selectedCategory, selectedSubCategory);
    } else if (currentScreen === 'products') {
      navigateToSubCategories(selectedCategory);
    } else if (currentScreen === 'subcategories') {
      navigateToCategories();
    } else if (currentScreen === 'cart') {
      if (selectedProduct) {
        navigateToProducts(selectedCategory, selectedSubCategory);
      } else {
        navigateToCategories();
      }
    } else {
      navigateToCategories();
    }
  };

  // Load product details when navigating to product detail screen via URL
  useEffect(() => {
    if (currentScreen === 'product-detail' && params.productId && !selectedProduct) {
      // In a real app, you'd fetch the product by ID from an API
      // For now, we'll create a mock product or handle it gracefully
      const mockProduct: Product = {
        id: params.productId,
        name: `Product ${params.productId}`,
        price: 99.99,
        image: '/placeholder.svg',
        description: 'Product description',
        sizes: ['S', 'M', 'L'],
        colors: ['Black', 'White'],
        category: params.category || '',
        subCategory: params.subcategory || ''
      };
      setSelectedProduct(mockProduct);
    }
  }, [currentScreen, params.productId, params.category, params.subcategory, selectedProduct]);

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        cartItem => cartItem.id === item.id && 
        cartItem.size === item.size && 
        cartItem.color === item.color
      );
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id && 
          cartItem.size === item.size && 
          cartItem.color === item.color
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      
      return [...prevCart, item];
    });
  };

  const updateCartQuantity = (id: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (id: string, size: string, color: string) => {
    setCart(prevCart =>
      prevCart.filter(item =>
        !(item.id === id && item.size === size && item.color === color)
      )
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onStart={navigateToCategories} />;
      case 'categories':
        return (
          <CategoriesScreen
            onCategorySelect={navigateToSubCategories}
          />
        );
      case 'subcategories':
        return (
          <SubCategoriesScreen
            category={selectedCategory}
            onSubCategorySelect={(subCategory) => navigateToProducts(selectedCategory, subCategory)}
            onBack={handleBack}
          />
        );
      case 'products':
        return (
          <ProductListScreen
            category={selectedCategory}
            subCategory={selectedSubCategory}
            onProductSelect={(product) => navigateToProductDetail(selectedCategory, selectedSubCategory, product.id, product)}
            onBack={handleBack}
          />
        );
      case 'product-detail':
        return (
          <ProductDetailScreen
            product={selectedProduct}
            onAddToCart={addToCart}
            onBack={handleBack}
          />
        );
      case 'cart':
        return (
          <ShoppingCartScreen
            cart={cart}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
            onContinueShopping={navigateToCategories}
            onBack={handleBack}
          />
        );
      default:
        return <WelcomeScreen onStart={navigateToCategories} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex">
      {/* Main Content Area */}
      <div className="flex-1 min-h-screen">
        {/* Header */}
        <header className="bg-background shadow-sm border-b border">
          <div className={`px-4 md:px-8 lg:px-10 transition-all duration-300 ${isCartExpanded && currentScreen !== 'cart' ? (isRTL ? 'lg:ml-80' : 'lg:mr-80') : ''}`}>
            <div className="flex justify-between items-center h-16">
              {/* Mobile Header */}
              {isMobile ? (
                <>
                  <div className="flex items-center">
                    <button
                      className="p-2 rounded-lg hover:bg-muted dark:hover:bg-muted transition-colors text-foreground mr-2"
                      aria-label="Open menu"
                      onClick={() => setIsDrawerOpen(true)}
                    >
                      <Menu className="w-6 h-6" />
                    </button>
                    <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent cursor-pointer" onClick={navigateToWelcome}>
                      {t('header.brand')}
                    </div>
                  </div>
                  {/* Theme toggle and Cart always visible on right */}
                  <div className="flex items-center gap-2">
                    {/* Theme Toggle (copied from LanguageSwitcher) */}
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-lg hover:bg-muted dark:hover:bg-muted transition-colors"
                      aria-label="Toggle theme"
                    >
                      {isDark ? (
                        <Sun className="w-5 h-5 text-foreground" />
                      ) : (
                        <Moon className="w-5 h-5 text-foreground" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (currentScreen === 'cart') {
                          handleBack();
                        } else {
                          // On mobile, go directly to cart page
                          navigateToCart();
                        }
                      }}
                      className="relative p-2 rounded-lg hover:bg-muted dark:hover:bg-muted transition-colors text-foreground"
                      aria-label={t('header.cart')}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {getTotalItems() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {getTotalItems()}
                        </span>
                      )}
                    </button>
                  </div>
                  {/* Drawer for menu */}
                  {isDrawerOpen && (
                    <div className="fixed inset-0 z-50 flex">
                      <div className="bg-background dark:bg-background w-64 h-full shadow-lg flex flex-col max-h-screen overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border">
                          <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent cursor-pointer" onClick={() => { navigateToWelcome(); setIsDrawerOpen(false); }}>
                            {t('header.brand')}
                          </div>
                          <button
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted dark:bg-muted hover:bg-muted dark:hover:bg-muted transition-colors ml-2"
                            onClick={() => setIsDrawerOpen(false)}
                            aria-label="Close menu"
                          >
                            <span className="text-2xl text-red-500 font-bold">×</span>
                          </button>
                        </div>
                        <div className="flex-1 flex flex-col gap-2 p-6">
                          <a
                            href="/merchant"
                            className="block w-full text-left text-base text-foreground font-medium rounded-lg py-3 px-4 hover:bg-muted dark:hover:bg-muted transition-colors"
                            onClick={() => setIsDrawerOpen(false)}
                          >
                            {t('header.merchantPortal')}
                          </a>
                          <div className="flex-1" />
                        </div>
                        {/* Language Switcher fixed at bottom - only language, not theme toggle */}
                        <div className="p-4 border-t border bg-background dark:bg-background sticky bottom-0 w-full">
                          <div className="flex items-center gap-2 justify-center">
                            <Globe className="w-5 h-5 text-foreground" />
                            <select
                              value={language}
                              onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
                              className="text-sm bg-transparent border-none outline-none cursor-pointer text-foreground hover:text-purple-600 dark:hover:text-purple-400"
                            >
                              <option value="en">English</option>
                              <option value="ar">العربية</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 bg-black/30" onClick={() => setIsDrawerOpen(false)} />
                    </div>
                  )}
                </>
              ) : (
                // Desktop Header
                <>
                  {/* Logo */}
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={navigateToWelcome}
                  >
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {t('header.brand')}
                    </div>
                  </div>
                  {/* Language Switcher, Merchant Link, and Cart */}
                  <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <a
                      href="/merchant"
                      className="text-sm text-foreground hover:text-purple-600 transition-colors font-medium"
                    >
                      {t('header.merchantPortal')}
                    </a>
                    <button
                      onClick={() => {
                        if (currentScreen === 'cart') {
                          handleBack();
                        } else {
                          // On desktop, toggle sidebar or go to cart
                          if (isCartExpanded) {
                            navigateToCart();
                          } else {
                            setIsCartExpanded(true);
                          }
                        }
                      }}
                      className="relative p-2 rounded-lg hover:bg-muted dark:hover:bg-muted transition-colors text-foreground"
                      aria-label={t('header.cart')}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {getTotalItems() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {getTotalItems()}
                        </span>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={`transition-all duration-300 ${isCartExpanded && currentScreen !== 'cart' ? (isRTL ? 'lg:ml-80' : 'lg:mr-80') : ''}`}>
          {renderScreen()}
        </main>
      </div>

      {/* Persistent Cart Sidebar - Only visible when not on cart page */}
      {currentScreen !== 'cart' && (
        <PersistentCartSidebar
          cart={cart}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          getCartTotal={getCartTotal}
          getTotalItems={getTotalItems}
          isExpanded={isCartExpanded}
          onToggle={() => setIsCartExpanded(!isCartExpanded)}
        />
      )}

      {/* Voice UI - Visible when voice is active */}
      {isVoiceActive && (
        <VoiceUI
          isActive={isVoiceActive}
          onEnd={stopVoice}
        />
      )}
    </div>
  );
};

export default Index;
