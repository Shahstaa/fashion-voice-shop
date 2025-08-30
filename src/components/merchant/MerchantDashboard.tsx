import { useState } from 'react';
import { MerchantSidebar } from './MerchantSidebar';
import { DashboardOverview } from './DashboardOverview';
import { SalesTracking } from './SalesTracking';
import { CategoryManagement } from './CategoryManagement';
import { SubCategoryManagement } from './SubCategoryManagement';
import { ItemManagement } from './ItemManagement';
import { SettingsPanel } from './SettingsPanel';
import { WidgetCreator } from './WidgetCreator';
import { Merchant } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';

interface MerchantDashboardProps {
  merchant: Merchant;
  onLogout: () => void;
}

export const MerchantDashboard = ({ merchant, onLogout }: MerchantDashboardProps) => {
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview merchant={merchant} />;
      case 'sales':
        return <SalesTracking />;
      case 'categories':
        return <CategoryManagement />;
      case 'subcategories':
        return <SubCategoryManagement />;
      case 'items':
        return <ItemManagement />;
      case 'widget':
        return <WidgetCreator />;
      case 'settings':
        return <SettingsPanel merchant={merchant} />;
      default:
        return <DashboardOverview merchant={merchant} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <MerchantSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onLogout={onLogout}
      />
      <div className={`flex-1 ${isRTL ? 'mr-64' : 'ml-64'}`}> 
        <main className="p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
