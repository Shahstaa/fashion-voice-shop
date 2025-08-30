import { BarChart3, Package, Settings, LogOut, Home, ShoppingBag, Tags, FolderTree } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface MerchantSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'overview', icon: Home, labelKey: 'merchant.nav.overview' },
  { id: 'sales', icon: BarChart3, labelKey: 'merchant.nav.sales' },
  { id: 'categories', icon: Tags, labelKey: 'merchant.nav.categories' },
  { id: 'subcategories', icon: FolderTree, labelKey: 'merchant.nav.subcategories' },
  { id: 'items', icon: Package, labelKey: 'merchant.nav.items' },
  { id: 'widget', icon: ShoppingBag, labelKey: 'merchant.nav.widget' },
  { id: 'settings', icon: Settings, labelKey: 'merchant.nav.settings' },
];

export const MerchantSidebar = ({ activeTab, onTabChange, onLogout }: MerchantSidebarProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`fixed ${isRTL ? 'right-0' : 'left-0'} top-0 h-full w-64 bg-white dark:bg-slate-800 shadow-xl z-50`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          {t('merchant.brand')}
        </div>
        <LanguageSwitcher />
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{t(item.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={onLogout}
          className={`w-full flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors`}
        >
          <LogOut className="w-5 h-5" />
          <span>{t('merchant.nav.logout')}</span>
        </button>
      </div>
    </div>
  );
};
