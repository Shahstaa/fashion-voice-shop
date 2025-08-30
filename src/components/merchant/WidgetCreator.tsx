
import { useState } from 'react';
import { Code, Copy, Eye, Settings, Palette, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const WidgetCreator = () => {
  const { t, isRTL } = useLanguage();
  const [widgetConfig, setWidgetConfig] = useState({
    theme: 'light',
    primaryColor: '#8B5CF6',
    position: 'bottom-right',
    greeting: 'مرحباً! كيف يمكنني مساعدتك؟',
    showAvatar: true
  });

  const generateWidgetCode = () => {
    return `<!-- Zibda Voice Shopping Widget -->
<script>
  window.ZibdaConfig = {
    merchantId: "YOUR_MERCHANT_ID",
    theme: "${widgetConfig.theme}",
    primaryColor: "${widgetConfig.primaryColor}",
    position: "${widgetConfig.position}",
    greeting: "${widgetConfig.greeting}",
    showAvatar: ${widgetConfig.showAvatar},
    language: "ar"
  };
</script>
<script src="https://widget.zibda.ai/embed.js" async></script>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateWidgetCode());
    // You could add a toast notification here
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {t('merchant.widget.title')}
        </h1>
        <p className="text-slate-600">
          {t('merchant.widget.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <Settings className={`w-6 h-6 ${isRTL ? 'ml-3' : 'mr-3'} text-purple-600`} />
            {t('merchant.widget.configuration')}
          </h2>

          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="appearance">{t('merchant.widget.appearance')}</TabsTrigger>
              <TabsTrigger value="behavior">{t('merchant.widget.behavior')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('merchant.widget.theme')}
                </label>
                <select
                  value={widgetConfig.theme}
                  onChange={(e) => setWidgetConfig(prev => ({ ...prev, theme: e.target.value }))}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="light">{t('merchant.widget.lightTheme')}</option>
                  <option value="dark">{t('merchant.widget.darkTheme')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('merchant.widget.primaryColor')}
                </label>
                <Input
                  type="color"
                  value={widgetConfig.primaryColor}
                  onChange={(e) => setWidgetConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-full h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('merchant.widget.position')}
                </label>
                <select
                  value={widgetConfig.position}
                  onChange={(e) => setWidgetConfig(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="bottom-right">{t('merchant.widget.bottomRight')}</option>
                  <option value="bottom-left">{t('merchant.widget.bottomLeft')}</option>
                  <option value="top-right">{t('merchant.widget.topRight')}</option>
                  <option value="top-left">{t('merchant.widget.topLeft')}</option>
                </select>
              </div>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('merchant.widget.greeting')}
                </label>
                <Input
                  value={widgetConfig.greeting}
                  onChange={(e) => setWidgetConfig(prev => ({ ...prev, greeting: e.target.value }))}
                  placeholder={t('merchant.widget.greetingPlaceholder')}
                />
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={widgetConfig.showAvatar}
                    onChange={(e) => setWidgetConfig(prev => ({ ...prev, showAvatar: e.target.checked }))}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {t('merchant.widget.showAvatar')}
                  </span>
                </label>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Code Generation & Preview */}
        <div className="space-y-6">
          {/* Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <Eye className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'} text-purple-600`} />
              {t('merchant.widget.preview')}
            </h3>
            <div className="bg-slate-100 rounded-lg p-4 min-h-32 relative">
              <div 
                className={`absolute ${widgetConfig.position.includes('bottom') ? 'bottom-4' : 'top-4'} ${widgetConfig.position.includes('right') ? 'right-4' : 'left-4'}`}
              >
                <div 
                  className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform ${widgetConfig.theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}
                  style={{ borderColor: widgetConfig.primaryColor, borderWidth: '2px' }}
                >
                  <MessageSquare className="w-6 h-6" style={{ color: widgetConfig.primaryColor }} />
                </div>
              </div>
            </div>
          </div>

          {/* Generated Code */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <Code className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'} text-purple-600`} />
              {t('merchant.widget.embedCode')}
            </h3>
            <div className="bg-slate-900 rounded-lg p-4 relative">
              <pre className="text-green-400 text-sm overflow-x-auto">
                <code>{generateWidgetCode()}</code>
              </pre>
              <Button
                onClick={copyToClipboard}
                size="sm"
                className="absolute top-2 right-2 bg-slate-700 hover:bg-slate-600"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Installation Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-bold text-blue-900 mb-2">{t('merchant.widget.instructions')}</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. {t('merchant.widget.step1')}</li>
              <li>2. {t('merchant.widget.step2')}</li>
              <li>3. {t('merchant.widget.step3')}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
