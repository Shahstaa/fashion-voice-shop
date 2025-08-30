import { Plus, Minus, X, ShoppingBag } from 'lucide-react';
import { CartItem } from '@/pages/Index';
import { useLanguage } from '@/hooks/useLanguage';

interface PersistentCartSidebarProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, size: string, color: string, quantity: number) => void;
  onRemoveItem: (id: string, size: string, color: string) => void;
  getCartTotal: () => number;
  getTotalItems: () => number;
  isExpanded: boolean;
  onToggle: () => void;
}

export const PersistentCartSidebar = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  getCartTotal,
  getTotalItems,
  isExpanded,
  onToggle
}: PersistentCartSidebarProps) => {
  const { t, language, isRTL } = useLanguage();
  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const formatPrice = (price: number) => {
    if (language === 'ar') {
      // Convert USD to SAR (approximate rate 1 USD = 5 SAR)
      const sarPrice = price * 5;
      return `${sarPrice} ريال`;
    }
    return `$${price}`;
  };

  const formatTotal = (amount: number) => {
    if (language === 'ar') {
      const sarAmount = amount * 5;
      return `${sarAmount.toFixed(2)} ريال`;
    }
    return `$${amount.toFixed(2)}`;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Cart Sidebar */}
      <div className={`
        fixed ${isRTL ? 'left-0' : 'right-0'} top-0 h-full bg-card shadow-2xl z-50 transform transition-transform duration-300
        ${isExpanded ? 'w-80' : 'w-0'}
        ${isExpanded ? 'translate-x-0' : (isRTL ? '-translate-x-full' : 'translate-x-full')}
        ${isRTL ? 'rounded-r-xl' : 'rounded-l-xl'}
        overflow-hidden
      `}>
        {/* Cart Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              <ShoppingBag className="w-6 h-6" />
              <h2 className="text-xl font-bold">{t('cart.title')}</h2>
            </div>
            <button
              onClick={onToggle}
              className="text-white hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {getTotalItems() > 0 && (
            <p className="text-sm opacity-90 mt-1">
              {getTotalItems()} {getTotalItems() === 1 ? t('cart.item') : t('cart.items')}
            </p>
          )}
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-full">
          {cart.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  {t('cart.empty')}
                </h3>
                <p className="text-gray-500 text-sm">
                  Add some items to get started!
                </p>
              </div>
            </div>
          ) : (
            /* Cart with Items */
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.map((item, index) => (
                  <div 
                    key={`${item.id}-${item.size}-${item.color}-${index}`} 
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                  >
                    {/* Product Info */}
                    <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-purple-600">
                            {formatPrice(item.price)}
                          </span>
                          <button
                            onClick={() => onRemoveItem(item.id, item.size, item.color)}
                            className="text-red-500 hover:text-red-700 text-xs"
                            title={t('cart.remove')}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-semibold text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <span className="font-bold text-gray-800">
                        {formatTotal(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{t('cart.subtotal')}:</span>
                    <span>{formatTotal(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{t('cart.tax')} (8%):</span>
                    <span>{formatTotal(tax)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>{t('cart.total')}:</span>
                    <span>{formatTotal(total)}</span>
                  </div>
                </div>

                <button
                  disabled
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed opacity-75 mb-2"
                >
                  {t('cart.checkout')} (Coming Soon)
                </button>
                
                <button
                  onClick={onToggle}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {t('cart.continueShopping')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
