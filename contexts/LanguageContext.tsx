import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    appTitle: "30 Days Sugar Free",
    nav: {
      tracker: "التحدي",
      scanner: "فحص الطعام",
      guide: "المسموح/الممنوع"
    },
    tracker: {
      title: "رحلتك نحو الصحة",
      subtitle: "أكمل 30 يومًا لتعيد برمجة جسمك",
      setupTitle: "سجل قياساتك قبل البدء 📏",
      weight: "الوزن (كغ)",
      height: "الطول (سم)",
      saveStart: "حفظ وبدء التحدي",
      statsTitle: "إحصائيات جسمك",
      updateWeight: "تحديث الوزن",
      cancel: "إلغاء",
      start: "البداية",
      current: "الحالي",
      result: "النتيجة",
      progress: "من",
      days: "يوم",
      completedDays: "من 30 يوم"
    },
    scanner: {
      title: "كاشف السكر الذكي",
      placeholder: "التقط صورة للطعام أو المنتج",
      cameraBtn: "تشغيل الكاميرا",
      orSearch: "أو ابحث بالاسم",
      label: "اكتب اسم الطعام أو الشراب",
      inputPlaceholder: "مثال: كب كيك، عصير برتقال...",
      analyzeBtn: "فحص",
      analyzing: "جاري تحليل المكونات...",
      error: "حدث خطأ أثناء التحليل. حاول مرة أخرى.",
      defaultText: "تحليل الطعام",
      resultTitle: "المعلومات الغذائية (تقريبية)",
      sugar: "نسبة السكر",
      calories: "السعرات",
      macros: {
        p: "بروتين",
        c: "كاربوهيدرات",
        f: "دهون"
      },
      compliant: "✅ مسموح (خالي من السكر)",
      forbidden: "❌ يحتوي على سكر/ممنوع",
      compliantText: "مسموح",
      forbiddenText: "ممنوع"
    },
    guide: {
      title: "دليل الطعام",
      allowed: "✅ المسموح",
      forbidden: "❌ الممنوع",
      tip: "💡"
    }
  },
  en: {
    appTitle: "30 Days Sugar Free",
    nav: {
      tracker: "Tracker",
      scanner: "Scanner",
      guide: "Guide"
    },
    tracker: {
      title: "Your Journey to Health",
      subtitle: "Complete 30 days to reset your body",
      setupTitle: "Record stats before starting 📏",
      weight: "Weight (kg)",
      height: "Height (cm)",
      saveStart: "Save & Start Challenge",
      statsTitle: "Body Stats",
      updateWeight: "Update Weight",
      cancel: "Cancel",
      start: "Start",
      current: "Current",
      result: "Result",
      progress: "of",
      days: "days",
      completedDays: "of 30 days"
    },
    scanner: {
      title: "Smart Sugar Scanner",
      placeholder: "Take a photo of food or product",
      cameraBtn: "Open Camera",
      orSearch: "Or search by name",
      label: "Type food or drink name",
      inputPlaceholder: "Ex: Cupcake, Orange Juice...",
      analyzeBtn: "Scan",
      analyzing: "Analyzing ingredients...",
      error: "Error during analysis. Please try again.",
      defaultText: "Food Analysis",
      resultTitle: "Nutrition Facts (Approx)",
      sugar: "Sugar %",
      calories: "Calories",
      macros: {
        p: "Protein",
        c: "Carbs",
        f: "Fats"
      },
      compliant: "✅ Allowed (Sugar Free)",
      forbidden: "❌ Contains Sugar/Forbidden",
      compliantText: "Allowed",
      forbiddenText: "Forbidden"
    },
    guide: {
      title: "Food Guide",
      allowed: "✅ Allowed",
      forbidden: "❌ Forbidden",
      tip: "💡"
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.ar;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language],
    dir: language === 'ar' ? 'rtl' : 'ltr'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};