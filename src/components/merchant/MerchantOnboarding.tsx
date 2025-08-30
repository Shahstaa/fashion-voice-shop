import { useState } from 'react';
import { Store, Plus, ArrowRight, Zap } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface MerchantOnboardingProps {
  onContinue: (option: 'import' | 'new', platform?: string) => void;
}

export const MerchantOnboarding = ({ onContinue }: MerchantOnboardingProps) => {
  const { t, isRTL } = useLanguage();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');

  const platforms = [
    { id: 'zid', name: 'Zid', color: 'from-blue-500 to-blue-600' },
    { id: 'salla', name: 'Salla', color: 'from-green-500 to-green-600' },
    { id: 'woocommerce', name: 'WooCommerce', color: 'from-purple-500 to-purple-600' },
    { id: 'shopify', name: 'Shopify', color: 'from-emerald-500 to-emerald-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4 dark:from-[#18181b] dark:to-[#23272f]">
      <div className="max-w-2xl w-full">
        <div className="bg-background rounded-2xl shadow-xl p-8 dark:bg-[#18181b]">
          {/* Language Switcher */}
          <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} mb-4`}>
            <LanguageSwitcher />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              {t('merchant.brand')}
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {t('merchant.onboarding.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('merchant.onboarding.subtitle')}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-6 mb-8">
            {/* Import Existing Store */}
            <div className="border-2 border-dashed border-border rounded-xl p-6 hover:border-purple-300 transition-colors dark:border-[#23272f] dark:hover:border-purple-700">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                <Store className={`w-6 h-6 ${isRTL ? 'ml-3' : 'mr-3'} text-purple-600`} />
                {t('merchant.onboarding.importStore')}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t('merchant.onboarding.importDescription')}
              </p>
              
              {/* Platform Selection */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedPlatform === platform.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950'
                        : 'border-border hover:border-muted dark:border-[#23272f] dark:hover:border-muted'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${platform.color} mb-2 mx-auto`}></div>
                    <p className="font-medium text-foreground">{platform.name}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => onContinue('import', selectedPlatform)}
                disabled={!selectedPlatform}
                className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-muted disabled:to-muted-foreground text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}
              >
                <span>{t('merchant.onboarding.continueImport')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Create New Store */}
            <div className="border-2 border-dashed border-border rounded-xl p-6 hover:border-purple-300 transition-colors dark:border-[#23272f] dark:hover:border-purple-700">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                <Plus className={`w-6 h-6 ${isRTL ? 'ml-3' : 'mr-3'} text-purple-600`} />
                {t('merchant.onboarding.createNew')}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t('merchant.onboarding.createDescription')}
              </p>
              
              <button
                onClick={() => onContinue('new')}
                className={`w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}
              >
                <span>{t('merchant.onboarding.continueNew')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {t('merchant.onboarding.helpText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
