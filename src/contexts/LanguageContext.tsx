import React, { useState, useCallback, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LanguageContext, Translations, LanguageContextProps } from './LanguageTypes';
import { loadDynamicTranslations } from '@/lib/translationHelpers';

// Define translations outside component to avoid dependency issues
const translations: { [key: string]: Translations } = {
  en: {
    header: {
      brand: 'Zibda',
      merchantPortal: 'Merchant Portal',
    },
    welcome: {
      title: 'Voice Shopping Revolution',
      subtitle: 'Shop with Your Voice',
      description: 'Experience the future of online shopping with our voice-powered platform.',
      startShopping: 'Start Voice Shopping',
    },
    nav: {
      home: 'Home',
      back: 'Back',
      overview: 'Overview',
      sales: 'Sales',
      categories: 'Categories',
      subcategories: 'Subcategories',
      items: 'Items',
      widget: 'Widget',
      settings: 'Settings',
      logout: 'Logout'
    },
    ui: {
      exploreCollections: 'Explore Our Collections',
      chooseCategoryPrompt: 'Browse through our curated categories and discover the perfect items for your needs.',
      searchPlaceholder: 'Search for products...',
      workingOnProducts: 'We\'re working on adding products to this category.',
      previousPage: 'Previous',
      nextPage: 'Next',
      pageOf: 'Page {current} of {total}',
    },
    voice: {
      categoriesPrompt: 'What are you looking for today?',
      helpPrompt: 'Need assistance? Just ask!',
      productsPrompt: 'Tell me which product interests you',
      productDetailPrompt: 'Say "Add to cart", "Choose size", or "Different color"',
    },
      categories: {
        mensApparel: 'Men\'s Apparel',
        mensApparelDesc: 'Discover the latest trends in men\'s fashion.',
        womensApparel: 'Women\'s Apparel',
        womensApparelDesc: 'Explore our wide range of women\'s clothing.',
        kidsClothing: 'Kids\' Clothing',
        kidsClothingDesc: 'Dress your little ones in style with our adorable collection.',
        footwear: 'Footwear',
        footwearDesc: 'Step out in comfort and style with our diverse footwear selection.',
        accessories: 'Accessories',
        accessoriesDesc: 'Complete your look with our trendy accessories.',
        sale: 'Sale',
        saleDesc: 'Grab amazing deals on selected items!',
      },
      subcategories: {
        tshirts: 'T-Shirts',
        tshirtsDesc: 'Comfortable and stylish t-shirts for everyday wear.',
        shirts: 'Shirts',
        shirtsDesc: 'Professional and casual shirts for any occasion.',
        blouses: 'Blouses',
        blousesDesc: 'Elegant blouses perfect for work or casual outings.',
        jeans: 'Jeans',
        jeansDesc: 'Durable and fashionable jeans in various fits.',
        jackets: 'Jackets',
        jacketsDesc: 'Stay warm and stylish with our jacket collection.',
      },
      products: {
        whiteCrewNeck: 'White Crew Neck T-Shirt',
        whiteCrewNeckDesc: 'Classic white crew neck t-shirt made from 100% cotton.',
        vintageGraphic: 'Vintage Graphic Tee',
        vintageGraphicDesc: 'Retro-style graphic t-shirt with vintage prints.',
        premiumCotton: 'Premium Cotton Tee',
        premiumCottonDesc: 'High-quality cotton t-shirt with superior comfort.',
        classicFit: 'Classic Fit T-Shirt',
        classicFitDesc: 'Timeless classic fit t-shirt suitable for all occasions.',
        slimFit: 'Slim Fit T-Shirt',
        slimFitDesc: 'Modern slim fit t-shirt for a contemporary look.',
        oversized: 'Oversized T-Shirt',
        oversizedDesc: 'Trendy oversized t-shirt for a relaxed, casual style.',
        // New product keys
        whiteTshirt: 'White Crew Neck T-Shirt',
        whiteTshirtDesc: 'Classic white crew neck t-shirt made from 100% cotton.',
        vintageTee: 'Vintage Graphic Tee',
        vintageTeeDesc: 'Retro-style graphic t-shirt with vintage prints.',
        premiumTee: 'Premium Cotton Tee',
        premiumTeeDesc: 'High-quality cotton t-shirt with superior comfort.',
        whiteDressShirt: 'Classic White Dress Shirt',
        whiteDressShirtDesc: 'Professional white dress shirt for business wear.',
        plaidShirt: 'Casual Plaid Shirt',
        plaidShirtDesc: 'Comfortable plaid shirt for casual occasions.',
        blueJeans: 'Classic Blue Jeans',
        blueJeansDesc: 'Traditional blue jeans with classic fit.',
        slimJeans: 'Slim Fit Dark Jeans',
        slimJeansDesc: 'Modern slim fit jeans in dark wash.',
        leatherJacket: 'Leather Bomber Jacket',
        leatherJacketDesc: 'Stylish leather bomber jacket for cool weather.',
        cottonVneck: 'Soft Cotton V-Neck',
        cottonVneckDesc: 'Comfortable cotton v-neck t-shirt for women.',
        floralTee: 'Floral Print Tee',
        floralTeeDesc: 'Beautiful floral print t-shirt for casual wear.',
        silkBlouse: 'Silk Blouse',
        silkBlouseDesc: 'Elegant silk blouse perfect for professional settings.',
        animalTee: 'Fun Animal Print Tee',
        animalTeeDesc: 'Colorful animal print t-shirt for kids.',
      },
      colors: {
        white: 'White',
        black: 'Black',
        gray: 'Gray',
        navy: 'Navy',
        red: 'Red',
        blue: 'Blue',
        green: 'Green',
        yellow: 'Yellow',
        pink: 'Pink',
      },
      cart: {
        title: 'Shopping Cart',
        item: 'item',
        items: 'items',
        empty: 'Your cart is empty',
        subtotal: 'Subtotal',
        tax: 'Tax',
        total: 'Total',
        checkout: 'Checkout',
        continueShopping: 'Continue Shopping',
        remove: 'Remove',
        quantity: 'Qty',
      },
      merchant: {
        brand: 'Zibda',
        dashboard: {
          welcome: 'Welcome',
          welcomeSubtitle: 'Here\'s what\'s happening with your store today.',
          totalSales: 'Total Sales',
          totalOrders: 'Total Orders',
          totalProducts: 'Total Products',
          conversionRate: 'Conversion Rate',
          recentActivity: 'Recent Activity',
          activity: {
            newOrder: 'New order received',
            productAdded: 'New product added',
            orderCompleted: 'Order completed'
          }
        },
        sales: {
          title: 'Sales Tracking',
          thisMonth: 'This Month',
          lastMonth: 'Last Month',
          growth: 'Growth',
          recentOrders: 'Recent Orders',
          orderNumber: 'Order #',
          customer: 'Customer',
          amount: 'Amount',
          status: 'Status',
          date: 'Date'
        },
        categories: {
          title: 'Category Management',
          addNew: 'Add New Category',
          name: 'Name',
          description: 'Description',
          actions: 'Actions'
        },
        subcategories: {
          title: 'Subcategory Management',
          addNew: 'Add New Subcategory',
          name: 'Name',
          description: 'Description',
          actions: 'Actions'
        },
        products: {
          title: 'Product Management',
          addNew: 'Add New Product'
        },
        settings: {
          title: 'Settings',
          profile: 'Profile Information',
          notifications: 'Notification Settings',
          save: 'Save Changes'
        },
        onboarding: {
          title: 'Start Your Merchant Journey',
          subtitle: 'Choose how you\'d like to get started with Zibda',
          importStore: 'Import Existing Store',
          importDescription: 'Connect your existing store and import your products and data',
          createNew: 'Create New Store',
          createDescription: 'Start from scratch and build your new online store',
          continueImport: 'Continue Import',
          continueNew: 'Continue Create',
          helpText: 'Need help? Contact us'
        },
        
        widget: {
          title: 'Create Zibda Widget',
          subtitle: 'Create a voice shopping widget to embed in your online store',
          configuration: 'Configuration',
          appearance: 'Appearance',
          behavior: 'Behavior',
          theme: 'Theme',
          lightTheme: 'Light',
          darkTheme: 'Dark',
          primaryColor: 'Primary Color',
          position: 'Position',
          bottomRight: 'Bottom Right',
          bottomLeft: 'Bottom Left',
          topRight: 'Top Right',
          topLeft: 'Top Left',
          greeting: 'Greeting Message',
          greetingPlaceholder: 'Hi! How can I help you?',
          showAvatar: 'Show Avatar',
          preview: 'Preview',
          embedCode: 'Embed Code',
          instructions: 'Installation Instructions',
          step1: 'Copy the code above',
          step2: 'Paste it before the closing </body> tag in your website',
          step3: 'Save changes and publish your website'
        },
        
        nav: {
          overview: 'Overview',
          sales: 'Sales',
          categories: 'Categories',
          subcategories: 'Subcategories',
          items: 'Items',
          widget: 'Widget',
          settings: 'Settings',
          logout: 'Logout'
        },
        
        auth: {
          loginTitle: 'Welcome Back',
          loginSubtitle: 'Login to manage your store.',
          signupTitle: 'Create an Account',
          signupSubtitle: 'Sign up to start selling your products.',
          fullName: 'Full Name',
          fullNamePlaceholder: 'Enter your full name',
          businessName: 'Business Name',
          businessNamePlaceholder: 'Enter your business name',
          phone: 'Phone Number',
          phonePlaceholder: 'Enter your phone number',
          address: 'Address',
          addressPlaceholder: 'Enter your business address',
          email: 'Email Address',
          emailPlaceholder: 'Enter your email address',
          password: 'Password',
          passwordPlaceholder: 'Enter your password',
          loginButton: 'Login',
          signupButton: 'Sign Up',
          noAccount: 'Don\'t have an account?',
          hasAccount: 'Already have an account?',
          signupLink: 'Sign up',
          loginLink: 'Login',
          loading: 'Loading...',
          loginError: 'Invalid email or password',
          signupError: 'Email already exists',
          generalError: 'Something went wrong. Please try again.',
          requiredFields: 'Please fill in all required fields',
          importTitle: 'Import from {platform}',
          importSubtitle: 'Connect your {platform} account to import your store',
          importButton: 'Import from {platform}',
          storeUrl: '{platform} Store URL',
          storeUrlPlaceholder: 'Enter your {platform} store URL'
        }
      }
    },
    ar: {
      header: {
        brand: 'زبدة',
        merchantPortal: 'بوابة التاجر',
      },
      welcome: {
        title: 'ثورة التسوق الصوتي',
        subtitle: 'تسوق بصوتك',
        description: 'اختبر مستقبل التسوق عبر الإنترنت مع منصتنا المدعومة بالصوت.',
        startShopping: 'ابدأ التسوق الصوتي',
      },
      nav: {
        home: 'الرئيسية',
        back: 'رجوع',
      },
      ui: {
        exploreCollections: 'اكتشف مجموعاتنا',
        chooseCategoryPrompt: 'تصفح من خلال الفئات المنسقة لدينا واكتشف العناصر المثالية التي تلبي احتياجاتك.',
        searchPlaceholder: 'ابحث عن المنتجات...',
        workingOnProducts: 'نحن نعمل على إضافة منتجات لهذه الفئة.',
        previousPage: 'السابق',
        nextPage: 'التالي',
        pageOf: 'صفحة {current} من {total}',
      },
      voice: {
        categoriesPrompt: 'ما الذي تبحث عنه اليوم؟',
        helpPrompt: 'تحتاج مساعدة؟ فقط اسأل!',
        productsPrompt: 'أخبرني أي منتج يثير اهتمامك',
        productDetailPrompt: 'قل "أضف إلى السلة" أو "اختر الحجم" أو "لون مختلف"',
      },
      categories: {
        mensApparel: 'الملابس الرجالية',
        mensApparelDesc: 'اكتشف أحدث الاتجاهات في أزياء الرجال.',
        womensApparel: 'الملابس النسائية',
        womensApparelDesc: 'استكشف مجموعتنا الواسعة من الملابس النسائية.',
        kidsClothing: 'ملابس الأطفال',
        kidsClothingDesc: 'ألبس أطفالك الصغار بأناقة مع مجموعتنا الرائعة.',
        footwear: 'الأحذية',
        footwearDesc: 'انطلق براحة وأناقة مع تشكيلتنا المتنوعة من الأحذية.',
        accessories: 'الإكسسوارات',
        accessoriesDesc: 'أكمل مظهرك مع إكسسواراتنا العصرية.',
        sale: 'تخفيضات',
        saleDesc: 'احصل على صفقات مذهلة على العناصر المحددة!',
      },
      subcategories: {
        tshirts: 'تي شيرت',
        tshirtsDesc: 'قمصان تي مريحة وأنيقة للارتداء اليومي.',
        shirts: 'قمصان',
        shirtsDesc: 'قمصان رسمية وعارضة تناسب أي مناسبة.',
        blouses: 'بلوزات',
        blousesDesc: 'بلوزات أنيقة مثالية للعمل أو الخروج غير الرسمي.',
        jeans: 'جينز',
        jeansDesc: 'جينزات متينة وعصرية بمختلف القصات.',
        jackets: 'جاكيتات',
        jacketsDesc: 'ابق دافئاً وأنيقاً مع مجموعة الجاكيتات لدينا.',
      },
      products: {
        whiteCrewNeck: 'تي شيرت أبيض كلاسيكي',
        whiteCrewNeckDesc: 'تي شيرت أبيض كلاسيكي مصنوع من 100% قطن.',
        vintageGraphic: 'تي شيرت جرافيك عتيق',
        vintageGraphicDesc: 'تي شيرت جرافيك بنمط عتيق مع طبعات كلاسيكية.',
        premiumCotton: 'تي شيرت قطن فاخر',
        premiumCottonDesc: 'تي شيرت قطن عالي الجودة براحة فائقة.',
        classicFit: 'تي شيرت قصة كلاسيكية',
        classicFitDesc: 'تي شيرت قصة كلاسيكية خالدة مناسب لجميع المناسبات.',
        slimFit: 'تي شيرت قصة ضيقة',
        slimFitDesc: 'تي شيرت قصة ضيقة عصرية للحصول على مظهر معاصر.',
        oversized: 'تي شيرت واسع',
        oversizedDesc: 'تي شيرت واسع عصري للحصول على نمط مريح وعارض.',
        // New product keys
        whiteTshirt: 'تي شيرت أبيض كلاسيكي',
        whiteTshirtDesc: 'تي شيرت أبيض كلاسيكي مصنوع من 100% قطن.',
        vintageTee: 'تي شيرت جرافيك عتيق',
        vintageTeeDesc: 'تي شيرت جرافيك بنمط عتيق مع طبعات كلاسيكية.',
        premiumTee: 'تي شيرت قطن فاخر',
        premiumTeeDesc: 'تي شيرت قطن عالي الجودة براحة فائقة.',
        whiteDressShirt: 'قميص أبيض رسمي كلاسيكي',
        whiteDressShirtDesc: 'قميص أبيض رسمي للارتداء المهني.',
        plaidShirt: 'قميص كاروهات عارض',
        plaidShirtDesc: 'قميص كاروهات مريح للمناسبات العارضة.',
        blueJeans: 'جينز أزرق كلاسيكي',
        blueJeansDesc: 'جينز أزرق تقليدي بقصة كلاسيكية.',
        slimJeans: 'جينز ضيق داكن',
        slimJeansDesc: 'جينز ضيق عصري بلون داكن.',
        leatherJacket: 'جاكيت جلد بومبر',
        leatherJacketDesc: 'جاكيت جلد أنيق للطقس البارد.',
        cottonVneck: 'تي شيرت قطن بفتحة V ناعم',
        cottonVneckDesc: 'تي شيرت قطن مريح بفتحة V للنساء.',
        floralTee: 'تي شيرت بطبعة زهور',
        floralTeeDesc: 'تي شيرت جميل بطبعة زهور للارتداء العارض.',
        silkBlouse: 'بلوزة حرير',
        silkBlouseDesc: 'بلوزة حرير أنيقة مثالية للبيئة المهنية.',
        animalTee: 'تي شيرت بطبعة حيوانات ممتعة',
        animalTeeDesc: 'تي شيرت ملون بطبعة حيوانات للأطفال.',
      },
      colors: {
        white: 'أبيض',
        black: 'أسود',
        gray: 'رمادي',
        navy: 'كحلي',
        red: 'أحمر',
        blue: 'أزرق',
        green: 'أخضر',
        yellow: 'أصفر',
        pink: 'وردي',
      },
      cart: {
        title: 'سلة التسوق',
        item: 'منتج',
        items: 'منتجات',
        empty: 'سلة التسوق فارغة',
        subtotal: 'المجموع الفرعي',
        tax: 'الضريبة',
        total: 'المجموع',
        checkout: 'الدفع',
        continueShopping: 'متابعة التسوق',
        remove: 'إزالة',
        quantity: 'الكمية',
      },
      merchant: {
        brand: 'زبدة',
        dashboard: {
          welcome: 'مرحباً',
          welcomeSubtitle: 'إليك ما يحدث في متجرك اليوم.',
          totalSales: 'إجمالي المبيعات',
          totalOrders: 'إجمالي الطلبات',
          totalProducts: 'إجمالي المنتجات',
          conversionRate: 'معدل التحويل',
          recentActivity: 'النشاط الأخير',
          activity: {
            newOrder: 'تم استلام طلب جديد',
            productAdded: 'تمت إضافة منتج جديد',
            orderCompleted: 'اكتمل الطلب'
          }
        },
        sales: {
          title: 'تتبع المبيعات',
          thisMonth: 'هذا الشهر',
          lastMonth: 'الشهر الماضي',
          growth: 'النمو',
          recentOrders: 'الطلبات الأخيرة',
          orderNumber: 'رقم الطلب',
          customer: 'العميل',
          amount: 'المبلغ',
          status: 'الحالة',
          date: 'التاريخ'
        },
        categories: {
          title: 'إدارة الفئات',
          addNew: 'إضافة فئة جديدة',
          name: 'الاسم',
          description: 'الوصف',
          actions: 'الإجراءات'
        },
        products: {
          title: 'إدارة المنتجات',
          addNew: 'إضافة منتج جديد'
        },
        settings: {
          title: 'الإعدادات',
          profile: 'معلومات الملف الشخصي',
          notifications: 'إعدادات الإشعارات',
          save: 'حفظ التغييرات'
        },
        onboarding: {
          title: 'ابدأ رحلتك التجارية',
          subtitle: 'اختر الطريقة التي تفضلها لبدء استخدام زبدة',
          importStore: 'استيراد متجر موجود',
          importDescription: 'اربط متجرك الحالي واستورد منتجاتك وبياناتك',
          createNew: 'إنشاء متجر جديد',
          createDescription: 'ابدأ من الصفر وأنشئ متجرك الإلكتروني الجديد',
          continueImport: 'متابعة الاستيراد',
          continueNew: 'متابعة الإنشاء',
          helpText: 'تحتاج مساعدة؟ تواصل معنا'
        },
        
        widget: {
          title: 'إنشاء ودجت زبدة',
          subtitle: 'أنشئ ودجت تسوق صوتي لدمجه في متجرك الإلكتروني',
          configuration: 'الإعدادات',
          appearance: 'المظهر',
          behavior: 'السلوك',
          theme: 'المظهر العام',
          lightTheme: 'فاتح',
          darkTheme: 'داكن',
          primaryColor: 'اللون الأساسي',
          position: 'الموقع',
          bottomRight: 'أسفل اليمين',
          bottomLeft: 'أسفل اليسار',
          topRight: 'أعلى اليمين',
          topLeft: 'أعلى اليسار',
          greeting: 'رسالة الترحيب',
          greetingPlaceholder: 'مرحباً! كيف يمكنني مساعدتك؟',
          showAvatar: 'إظهار الصورة الرمزية',
          preview: 'معاينة',
          embedCode: 'كود التضمين',
          instructions: 'تعليمات التثبيت',
          step1: 'انسخ الكود أعلاه',
          step2: 'الصقه قبل إغلاق تاج </body> في موقعك',
          step3: 'احفظ التغييرات وانشر موقعك'
        },
        
        nav: {
          overview: 'نظرة عامة',
          sales: 'المبيعات',
          categories: 'الفئات',
          subcategories: 'الفئات الفرعية',
          items: 'المنتجات',
          widget: 'الودجت',
          settings: 'الإعدادات',
          logout: 'تسجيل الخروج'
        },
        
        auth: {
          loginTitle: 'مرحباً بعودتك',
          loginSubtitle: 'سجل الدخول لإدارة متجرك.',
          signupTitle: 'إنشاء حساب',
          signupSubtitle: 'سجل لتبدأ في بيع منتجاتك.',
          fullName: 'الاسم الكامل',
          fullNamePlaceholder: 'أدخل اسمك الكامل',
          businessName: 'اسم العمل',
          businessNamePlaceholder: 'أدخل اسم عملك',
          phone: 'رقم الهاتف',
          phonePlaceholder: 'أدخل رقم هاتفك',
          address: 'العنوان',
          addressPlaceholder: 'أدخل عنوان عملك',
          email: 'عنوان البريد الإلكتروني',
          emailPlaceholder: 'أدخل عنوان بريدك الإلكتروني',
          password: 'كلمة المرور',
          passwordPlaceholder: 'أدخل كلمة مرورك',
          loginButton: 'تسجيل الدخول',
          signupButton: 'اشتراك',
          noAccount: 'ليس لديك حساب؟',
          hasAccount: 'هل لديك حساب بالفعل؟',
          signupLink: 'اشتراك',
          loginLink: 'تسجيل الدخول',
          loading: 'جار التحميل...',
          loginError: 'بريد إلكتروني أو كلمة مرور غير صحيحة',
          signupError: 'البريد الإلكتروني موجود بالفعل',
          generalError: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
          requiredFields: 'يرجى ملء جميع الحقول المطلوبة',
          importTitle: 'استيراد من {platform}',
          importSubtitle: 'اربط حسابك في {platform} لاستيراد متجرك',
          importButton: 'استيراد من {platform}',
          storeUrl: 'رابط متجر {platform}',
          storeUrlPlaceholder: 'أدخل رابط متجرك في {platform}'
        }
      }
    }
};

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('ar'); // Default to Arabic
  const [isInitialized, setIsInitialized] = useState(false);
  const isRTL = language === 'ar';

  // Initialize i18n when component mounts
  useEffect(() => {
    if (!isInitialized) {
      // Load dynamic translations
      const dynamicTranslations = loadDynamicTranslations();
      
      // Merge static and dynamic translations
      const mergedTranslations = {
        en: { ...translations.en, ...dynamicTranslations.en },
        ar: { ...translations.ar, ...dynamicTranslations.ar }
      };
      
      i18n
        .use(initReactI18next)
        .init({
          resources: {
            en: { translation: mergedTranslations.en },
            ar: { translation: mergedTranslations.ar },
          },
          lng: language,
          fallbackLng: 'en',
          interpolation: {
            escapeValue: false,
          },
          react: {
            useSuspense: false,
          },
        })
        .then(() => {
          setIsInitialized(true);
        });
    }
  }, [isInitialized, language]);

  const t = useCallback((key: string, options?: Record<string, string>): string => {
    if (!isInitialized) return key;
    const result = i18n.t(key, options);
    return typeof result === 'string' ? result : key;
  }, [isInitialized]);

  // Function to reload translations with dynamic data
  const reloadTranslations = useCallback(() => {
    if (isInitialized) {
      const dynamicTranslations = loadDynamicTranslations();
      
      // Merge static and dynamic translations
      const mergedTranslations = {
        en: { ...translations.en, ...dynamicTranslations.en },
        ar: { ...translations.ar, ...dynamicTranslations.ar }
      };
      
      // Add new resources to i18n
      i18n.addResources('en', 'translation', mergedTranslations.en);
      i18n.addResources('ar', 'translation', mergedTranslations.ar);
    }
  }, [isInitialized]);

  // Function to change the language
  const changeLanguage = useCallback((lang: string) => {
    setLanguage(lang);
    if (isInitialized) {
      i18n.changeLanguage(lang);
    }
  }, [isInitialized]);

  // Update i18n language when language state changes
  useEffect(() => {
    if (isInitialized && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, isInitialized]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, isRTL, reloadTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
};
