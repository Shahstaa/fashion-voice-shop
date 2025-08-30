import { ArrowLeft, Plus, Minus, X } from 'lucide-react';
import { CartItem } from '@/pages/Index';

interface ShoppingCartScreenProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, size: string, color: string, quantity: number) => void;
  onRemoveItem: (id: string, size: string, color: string) => void;
  onContinueShopping: () => void;
  onBack: () => void;
}

export const ShoppingCartScreen = ({ 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onContinueShopping, 
  onBack 
}: ShoppingCartScreenProps) => {
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <button 
            onClick={() => {/* Navigate to home */}}
            className="hover:text-purple-600 transition-colors"
          >
            Home
          </button>
          <span>{'>'}</span>
          <span className="text-foreground font-medium">Your Cart</span>
        </nav>
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Your Shopping Cart
          </h1>
          
          <button
            onClick={onBack}
            className="flex items-center text-muted-foreground hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
      </div>

      {/* Voice Prompt */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border transition-colors">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-sm text-muted-foreground">
            Say "Remove [item name]", "Continue shopping", or "Checkout"
          </span>
        </div>
      </div>

      {cart.length === 0 ? (
        /* Empty Cart */
        <div className="text-center py-12">
          <div className="bg-card rounded-xl shadow-md p-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Your cart is empty
            </h3>
            <p className="text-muted-foreground mb-6">
              Add some items to your cart to get started!
            </p>
            <button
              onClick={onContinueShopping}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Start Shopping
            </button>
          </div>
        </div>
      ) : (
        /* Cart with Items */
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="bg-card rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Cart Items ({cart.length})
              </h2>
              
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex items-center space-x-4 p-4 border border rounded-lg">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="text-lg font-semibold text-purple-600">
                        ${item.price}
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Item Total */}
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => onRemoveItem(item.id, item.size, item.color)}
                      className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="bg-card rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Order Summary
            </h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax:</span>
                <span>${(subtotal * 0.08).toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-xl font-bold text-foreground">
                <span>Total:</span>
                <span>${(subtotal * 1.08).toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onContinueShopping}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 px-6 rounded-xl font-semibold transition-colors"
              >
                Continue Shopping
              </button>
              
              <button
                disabled
                className="w-full bg-gradient-to-r from-slate-400 to-slate-500 text-white py-3 px-6 rounded-xl font-semibold cursor-not-allowed"
              >
                Proceed to Checkout (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
