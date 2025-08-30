import { useState, useEffect } from 'react';
import { MerchantOnboarding } from '@/components/merchant/MerchantOnboarding';
import { MerchantAuth } from '@/components/merchant/MerchantAuth';
import { MerchantDashboard } from '@/components/merchant/MerchantDashboard';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { useProductData } from '@/contexts/ProductDataContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const MerchantIndex = () => {
  const { t } = useLanguage();
  const { currentMerchant, isAuthenticated, logout } = useAuth();
  const { initializeMerchantData } = useProductData();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingChoice, setOnboardingChoice] = useState<{ type: 'import' | 'new', platform?: string } | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    if (isAuthenticated && currentMerchant) {
      // Initialize merchant data when authenticated
      initializeMerchantData(currentMerchant.id);
      setShowOnboarding(false);
    } else {
      // Show auth flow if not authenticated
      setShowOnboarding(false);
    }
  }, [isAuthenticated, currentMerchant, initializeMerchantData]);

  const handleOnboardingContinue = (option: 'import' | 'new', platform?: string) => {
    setOnboardingChoice({ type: option, platform });
    setShowOnboarding(false);
  };

  const handleLoginSuccess = () => {
    // Auth context handles the login, we just need to trigger data initialization
    if (currentMerchant) {
      initializeMerchantData(currentMerchant.id);
    }
  };

  const handleLogout = () => {
    logout();
    setShowOnboarding(false);
    setOnboardingChoice(null);
  };

  const handleStartOnboarding = () => {
    setShowOnboarding(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeProvider>
        {showOnboarding && <MerchantOnboarding onContinue={handleOnboardingContinue} />}
        
        {!showOnboarding && !isAuthenticated && (
          <MerchantAuth 
            onLoginSuccess={handleLoginSuccess} 
            importType={onboardingChoice}
            onStartOnboarding={handleStartOnboarding}
          />
        )}
        
        {isAuthenticated && currentMerchant && (
          <MerchantDashboard 
            merchant={currentMerchant} 
            onLogout={handleLogout} 
          />
        )}
      </ThemeProvider>
    </div>
  );
};

export default MerchantIndex;
