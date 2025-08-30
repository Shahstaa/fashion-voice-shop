
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const SalesTracking = () => {
  const { t, language } = useLanguage();

  const salesData = {
    thisMonth: language === 'ar' ? '٢٥,٣٠٠ ريال' : '$5,060',
    lastMonth: language === 'ar' ? '٢١,٨٠٠ ريال' : '$4,360',
    growth: '+16%'
  };

  const recentOrders = [
    {
      orderNumber: '#1234',
      customer: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohammed',
      amount: language === 'ar' ? '٢٥٠ ريال' : '$50',
      status: language === 'ar' ? 'مكتمل' : 'Completed',
      date: language === 'ar' ? '٢٠٢٤/١٢/١٥' : '2024-12-15'
    },
    {
      orderNumber: '#1235',
      customer: language === 'ar' ? 'فاطمة علي' : 'Fatima Ali',
      amount: language === 'ar' ? '١٧٥ ريال' : '$35',
      status: language === 'ar' ? 'قيد المعالجة' : 'Processing',
      date: language === 'ar' ? '٢٠٢٤/١٢/١٥' : '2024-12-15'
    },
    {
      orderNumber: '#1236',
      customer: language === 'ar' ? 'محمد سالم' : 'Mohammed Salem',
      amount: language === 'ar' ? '٣٠٠ ريال' : '$60',
      status: language === 'ar' ? 'مكتمل' : 'Completed',
      date: language === 'ar' ? '٢٠٢٤/١٢/١٤' : '2024-12-14'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {t('merchant.sales.title')}
        </h1>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 mb-1">{salesData.thisMonth}</p>
            <p className="text-sm text-slate-600">{t('merchant.sales.thisMonth')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-600 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 mb-1">{salesData.lastMonth}</p>
            <p className="text-sm text-slate-600">{t('merchant.sales.lastMonth')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600 mb-1">{salesData.growth}</p>
            <p className="text-sm text-slate-600">{t('merchant.sales.growth')}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">
          {t('merchant.sales.recentOrders')}
        </h2>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('merchant.sales.orderNumber')}</TableHead>
              <TableHead>{t('merchant.sales.customer')}</TableHead>
              <TableHead>{t('merchant.sales.amount')}</TableHead>
              <TableHead>{t('merchant.sales.status')}</TableHead>
              <TableHead>{t('merchant.sales.date')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell className="font-bold text-purple-600">{order.amount}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status.includes('مكتمل') || order.status.includes('Completed')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{order.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
