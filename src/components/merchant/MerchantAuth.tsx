import { useState } from 'react';
import { User, Mail, Phone, MapPin, Building2, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';

interface MerchantAuthProps {
  onLoginSuccess: () => void;
  importType?: { type: 'import' | 'new', platform?: string } | null;
  onStartOnboarding?: () => void;
}

export const MerchantAuth = ({ onLoginSuccess, importType, onStartOnboarding }: MerchantAuthProps) => {
  const { t, isRTL } = useLanguage();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(importType?.type === 'import');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    phone: '',
    address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        // Login flow
        const success = await login(formData.email, formData.password);
        if (success) {
          onLoginSuccess();
        } else {
          setError(t('merchant.auth.loginError'));
        }
      } else {
        // Signup flow
        if (!formData.name || !formData.email || !formData.password || !formData.businessName) {
          setError(t('merchant.auth.requiredFields'));
          return;
        }
        
        const success = await signup({
          name: formData.name,
          email: formData.email,
          businessName: formData.businessName,
          phone: formData.phone || '+966501234567',
          address: formData.address || 'Saudi Arabia'
        });
        
        if (success) {
          onLoginSuccess();
        } else {
          setError(t('merchant.auth.signupError'));
        }
      }
    } catch (error) {
      setError(t('merchant.auth.generalError'));
    } finally {
      setIsLoading(false);
    }
  };

  const [showAuthForm, setShowAuthForm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Persistent header for all screens
  const Header = () => (
    <header className="w-full flex items-center justify-between py-4 px-4 md:px-0 max-w-lg mx-auto">
      {showAuthForm ? (
        <button
          onClick={() => {
            setShowAuthForm(false);
            setIsLogin(true); // default to login on next open
          }}
          className="text-muted-foreground hover:text-foreground font-medium transition-colors"
          aria-label={t('nav.back')}
        >
          ← {t('nav.back')}
        </button>
      ) : (
        <button
          onClick={() => { window.location.href = '/'; }}
          className="text-muted-foreground hover:text-foreground font-medium transition-colors"
          aria-label={t('nav.home')}
        >
          ← {t('nav.home')}
        </button>
      )}
      <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        {t('merchant.brand')}
      </div>
      <LanguageSwitcher />
    </header>
  );

  // If not showing auth form, show welcome screen
  if (!showAuthForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col items-center justify-center px-4 dark:from-[#18181b] dark:to-[#23272f]">
        <Header />
        <div className="max-w-lg w-full">
          <div className="bg-background rounded-2xl shadow-xl p-8 dark:bg-[#18181b]">
            {/* Header (hidden, replaced by persistent header) */}
            {/* ...existing code... */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t('merchant.onboarding.title')}
              </h1>
              <p className="text-muted-foreground">
                {t('merchant.onboarding.subtitle')}
              </p>
            </div>
            {/* Options */}
            <div className="space-y-4">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setShowAuthForm(true);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {t('merchant.auth.loginButton')}
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setShowAuthForm(true);
                }}
                className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 py-3 px-4 rounded-lg font-semibold transition-all duration-200"
              >
                {t('merchant.auth.signupButton')}
              </button>
              {onStartOnboarding && (
                <button
                  onClick={onStartOnboarding}
                  className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 py-3 px-4 rounded-lg font-semibold transition-all duration-200"
                >
                  {t('merchant.onboarding.createNew')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col items-center justify-center px-4 dark:from-[#18181b] dark:to-[#23272f]">
      <Header />
      <div className="max-w-md w-full">
        <div className="bg-background rounded-2xl shadow-xl p-8 dark:bg-[#18181b]">
          {/* Header (hidden, replaced by persistent header) */}
          {/* ...existing code... */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {importType?.type === 'import' 
                ? t('merchant.auth.importTitle', { platform: importType.platform })
                : isLogin ? t('merchant.auth.loginTitle') : t('merchant.auth.signupTitle')
              }
            </h1>
            <p className="text-muted-foreground">
              {importType?.type === 'import'
                ? t('merchant.auth.importSubtitle', { platform: importType.platform })
                : isLogin ? t('merchant.auth.loginSubtitle') : t('merchant.auth.signupSubtitle')
              }
            </p>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-red-950 dark:border-red-900 dark:text-red-300">
                {error}
              </div>
            )}

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('merchant.auth.fullName')}
                  </label>
                  <div className="relative">
                    <User className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-slate-400`} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder={t('merchant.auth.fullNamePlaceholder')}
                      required={!isLogin}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('merchant.auth.businessName')}
                  </label>
                  <div className="relative">
                    <Building2 className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-slate-400`} />
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder={t('merchant.auth.businessNamePlaceholder')}
                      required={!isLogin}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('merchant.auth.phone')}
                  </label>
                  <div className="relative">
                    <Phone className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-slate-400`} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder={t('merchant.auth.phonePlaceholder')}
                      required={!isLogin}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('merchant.auth.address')}
                  </label>
                  <div className="relative">
                    <MapPin className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-slate-400`} />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      placeholder={t('merchant.auth.addressPlaceholder')}
                      required={!isLogin}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('merchant.auth.email')}
              </label>
              <div className="relative">
                <Mail className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-slate-400`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder={t('merchant.auth.emailPlaceholder')}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('merchant.auth.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full ${isRTL ? 'pr-4 pl-12' : 'pl-4 pr-12'} py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder={t('merchant.auth.passwordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} text-slate-400 hover:text-slate-600`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {isLoading ? t('merchant.auth.loading') : 
                (importType?.type === 'import'
                  ? t('merchant.auth.importButton', { platform: importType.platform })
                  : isLogin ? t('merchant.auth.loginButton') : t('merchant.auth.signupButton')
                )
              }
            </button>
          </form>
          {/* Toggle - only show if not import flow */}
          {!importType?.type && (
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isLogin ? t('merchant.auth.noAccount') : t('merchant.auth.hasAccount')}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-purple-600 hover:text-purple-700 font-semibold ml-1"
                >
                  {isLogin ? t('merchant.auth.signupLink') : t('merchant.auth.loginLink')}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
