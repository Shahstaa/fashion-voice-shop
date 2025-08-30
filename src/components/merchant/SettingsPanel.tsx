
import { useState } from 'react';
import { User, Building2, Bell, Save } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Merchant } from '@/pages/MerchantIndex';

interface SettingsPanelProps {
  merchant: Merchant;
}

export const SettingsPanel = ({ merchant }: SettingsPanelProps) => {
  const { t, isRTL } = useLanguage();
  const [profileData, setProfileData] = useState({
    name: merchant.name,
    email: merchant.email,
    phone: merchant.phone,
    businessName: merchant.businessName,
    address: merchant.address
  });

  const [notifications, setNotifications] = useState({
    orderAlerts: true,
    salesReports: true,
    lowStock: true,
    marketing: false
  });

  const handleProfileUpdate = () => {
    // Handle profile update
    console.log('Profile updated:', profileData);
  };

  const handleNotificationUpdate = () => {
    // Handle notification settings update
    console.log('Notifications updated:', notifications);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {t('merchant.settings.title')}
        </h1>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            {t('merchant.settings.profile')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('merchant.auth.fullName')}
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('merchant.auth.email')}
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('merchant.auth.phone')}
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('merchant.auth.businessName')}
            </label>
            <input
              type="text"
              value={profileData.businessName}
              onChange={(e) => setProfileData({...profileData, businessName: e.target.value})}
              className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('merchant.auth.address')}
            </label>
            <input
              type="text"
              value={profileData.address}
              onChange={(e) => setProfileData({...profileData, address: e.target.value})}
              className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleProfileUpdate}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{t('merchant.settings.save')}</span>
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-600 p-3 rounded-lg">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            {t('merchant.settings.notifications')}
          </h2>
        </div>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-800 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </h3>
                <p className="text-sm text-slate-600">
                  Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
