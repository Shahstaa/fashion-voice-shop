
import { TrendingUp, Package, ShoppingCart, DollarSign } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Merchant } from '@/pages/MerchantIndex';

interface DashboardOverviewProps {
  merchant: Merchant;
}

export const DashboardOverview = ({ merchant }: DashboardOverviewProps) => {
  const { t, language } = useLanguage();

  const stats = [
    {
      icon: DollarSign,
      labelKey: 'merchant.dashboard.totalSales',
      value: language === 'ar' ? '٧٥,٥٠٠ ريال' : '$15,750',
      change: '+12%',
      positive: true
    },
    {
      icon: ShoppingCart,
      labelKey: 'merchant.dashboard.totalOrders',
      value: language === 'ar' ? '٢٣٤' : '234',
      change: '+8%',
      positive: true
    },
    {
      icon: Package,
      labelKey: 'merchant.dashboard.totalProducts',
      value: language === 'ar' ? '٨٧' : '87',
      change: '+3%',
      positive: true
    },
    {
      icon: TrendingUp,
      labelKey: 'merchant.dashboard.conversionRate',
      value: language === 'ar' ? '٣.٢٪' : '3.2%',
      change: '+0.5%',
      positive: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {t('merchant.dashboard.welcome')}, {merchant.name}!
        </h1>
        <p className="text-slate-600">
          {t('merchant.dashboard.welcomeSubtitle')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-600">{t(stat.labelKey)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">
          {t('merchant.dashboard.recentActivity')}
        </h2>
        <div className="space-y-4">
          {[
            {
              titleKey: 'merchant.dashboard.activity.newOrder',
              time: language === 'ar' ? 'منذ ٥ دقائق' : '5 minutes ago',
              amount: language === 'ar' ? '٢٥٠ ريال' : '$50'
            },
            {
              titleKey: 'merchant.dashboard.activity.productAdded', 
              time: language === 'ar' ? 'منذ ١٥ دقيقة' : '15 minutes ago',
              amount: ''
            },
            {
              titleKey: 'merchant.dashboard.activity.orderCompleted',
              time: language === 'ar' ? 'منذ ٣٠ دقيقة' : '30 minutes ago', 
              amount: language === 'ar' ? '١٢٥ ريال' : '$25'
            }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-800">{t(activity.titleKey)}</p>
                <p className="text-sm text-slate-600">{activity.time}</p>
              </div>
              {activity.amount && (
                <div className="text-lg font-bold text-purple-600">
                  {activity.amount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
