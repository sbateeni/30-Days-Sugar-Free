import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface FoodItem {
  name: string;
  detail: string;
}

interface FoodCategory {
  emoji: string;
  name: string;
  desc: string;
  items: FoodItem[];
}

const FoodGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'allowed' | 'forbidden'>('allowed');
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { language, t } = useLanguage();

  const toggleCategory = (index: number) => {
    if (expandedCategory === index) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(index);
      setExpandedItem(null); // Close inner items when switching category
    }
  };

  const toggleItem = (itemName: string) => {
    if (expandedItem === itemName) {
      setExpandedItem(null);
    } else {
      setExpandedItem(itemName);
    }
  };

  // Arabic Data
  const allowedFoodsAr: FoodCategory[] = [
    { 
      emoji: '🥩', 
      name: 'اللحوم والأسماك', 
      desc: 'مصادر البروتين الأساسية، مسموحة بالكامل طالما لم يتم طهيها بصوصات سكرية.',
      items: [
        { name: 'لحم البقر والضأن', detail: 'غني بالحديد وفيتامين B12. يفضل القطع الخالية من الدهون المضافة.' },
        { name: 'الدجاج والدواجن', detail: 'مصدر ممتاز للبروتين. احذر من التتبيلات الجاهزة التي تحتوي على سكر.' },
        { name: 'الأسماك (السلمون، التونة)', detail: 'غنية بأحماض أوميغا 3 المفيدة للقلب والدماغ.' },
        { name: 'البيض', detail: 'خيار فطور مثالي، يحتوي على بروتين ودهون صحية تشعرك بالشبع.' }
      ]
    },
    { 
      emoji: '🥦', 
      name: 'الخضروات', 
      desc: 'كلما كان لونها أغمق كانت أفضل. ركز على الخضروات الورقية وغير النشوية.',
      items: [
        { name: 'الخضروات الورقية', detail: 'السبانخ، الجرجير، والخس. سعرات قليلة جداً وألياف عالية.' },
        { name: 'الخضروات الصليبية', detail: 'البروكلي والقرنبيط. ممتازة بديلة للأرز والمكرونة.' },
        { name: 'الكوسا والباذنجان', detail: 'متعددة الاستخدامات ويمكن استخدامها في طبخات متنوعة.' },
        { name: 'الخيار والفلفل', detail: 'وجبات خفيفة ممتازة مليئة بالماء والفيتامينات.' }
      ]
    },
    { 
      emoji: '🍓', 
      name: 'الفواكه قليلة السكر', 
      desc: 'مسموحة باعتدال (حصة أو حصتين يومياً) لاحتوائها على سكر الفركتوز الطبيعي.',
      items: [
        { name: 'الفراولة', detail: 'من أقل الفواكه احتواءً على السكر وغنية بمضادات الأكسدة.' },
        { name: 'التوت البري/الأزرق', detail: 'يعزز المناعة ونسبة السكر فيه منخفضة جداً.' },
        { name: 'الكيوي', detail: 'غني جداً بفيتامين C والألياف.' },
        { name: 'الأفوكادو', detail: 'فاكهة دهنية صحية تكاد تخلو من السكر تماماً.' }
      ]
    },
    { 
      emoji: '🥑', 
      name: 'الدهون الصحية', 
      desc: 'ضرورية للشبع والطاقة، خاصة عند تقليل السكريات والنشويات.',
      items: [
        { name: 'زيت الزيتون', detail: 'الأفضل للسلطات والطبخ البارد. دهون مفيدة للقلب.' },
        { name: 'المكسرات (لوز، جوز)', detail: 'تُؤكل نيئة وغير مملحة. حفنة صغيرة تكفي.' },
        { name: 'الزبدة الطبيعية', detail: 'الزبدة الحيوانية مسموحة، ابتعد عن المارجرين.' }
      ]
    },
    { 
      emoji: '🥛', 
      name: 'الألبان والأجبان', 
      desc: 'اختر الأنواع كاملة الدسم وغير المحلاة.',
      items: [
        { name: 'الزبادي اليوناني', detail: 'يحتوي على بروتين أعلى وسكر أقل من الزبادي العادي.' },
        { name: 'الأجبان الصلبة', detail: 'الشيدر، البارميزان. قليلة اللاكتوز (سكر الحليب).' },
        { name: 'اللبنة', detail: 'خيار ممتاز مع زيت الزيتون والخضار.' }
      ]
    },
    { 
      emoji: '☕', 
      name: 'المشروبات', 
      desc: 'الترطيب أساسي لتجنب الصداع في الأيام الأولى.',
      items: [
        { name: 'الماء', detail: 'اشرب 2-3 لتر يومياً لطرد السموم.' },
        { name: 'القهوة السوداء', detail: 'مسموحة بدون سكر. يمكن إضافة قليل من الحليب.' },
        { name: 'الشاي والأعشاب', detail: 'الشاي الأخضر، النعناع، الزنجبيل. مهدئة ومفيدة.' }
      ]
    },
  ];

  const forbiddenFoodsAr: FoodCategory[] = [
    { 
      emoji: '🍬', 
      name: 'الحلويات والسكريات', 
      desc: 'العدو الأول في هذا التحدي. ترفع الأنسولين وتسبب الجوع.',
      items: [
        { name: 'السكاكر والشوكولاتة', detail: 'سكر خالص ودهون مهدرجة.' },
        { name: 'الكعك والبيسكويت', detail: 'مزيج من السكر والدقيق الأبيض المضر.' },
        { name: 'الآيس كريم', detail: 'قنبلة سكرية يجب تجنبها تماماً.' }
      ]
    },
    { 
      emoji: '🥤', 
      name: 'المشروبات المحلاة', 
      desc: 'أخطر مصادر السكر لأن الجسم يمتصها بسرعة هائلة.',
      items: [
        { name: 'المشروبات الغازية', detail: 'العلبة الواحدة تحتوي على حوالي 10 ملاعق سكر!' },
        { name: 'عصائر الفاكهة', detail: 'حتى "الطبيعية" منها تفتقد للألياف وتعتبر ماء وسكر مركز.' },
        { name: 'مشروبات الطاقة', detail: 'مليئة بالسكر والكافيين المفرط.' }
      ]
    },
    { 
      emoji: '🍞', 
      name: 'النشويات البيضاء', 
      desc: 'تتحول في الجسم إلى سكر بسرعة، مما يفسد التحدي.',
      items: [
        { name: 'الخبز الأبيض', detail: 'يرفع سكر الدم بسرعة كبيرة.' },
        { name: 'الأرز الأبيض والمكرونة', detail: 'يفضل استبدالها بالخضروات أو كميات قليلة من الحبوب الكاملة.' },
        { name: 'المعجنات والفطائر', detail: 'تجمع بين الدقيق الأبيض والدهون غير الصحية.' }
      ]
    },
    { 
      emoji: '🥫', 
      name: 'الأطعمة الخفية', 
      desc: 'منتجات لا تبدو حلوة ولكنها مليئة بالسكر المضاف.',
      items: [
        { name: 'الصلصات (كاتشب، باربيكيو)', detail: 'الكاتشب يحتوي على كمية صادمة من السكر.' },
        { name: 'حبوب الإفطار (الكورن فليكس)', detail: 'غالبيتها مصنعة ومغلفة بالسكر.' },
        { name: 'الفواكه المجففة', detail: 'تركيز السكر فيها عالي جداً وتسهل المبالغة في أكلها.' }
      ]
    },
  ];

  // English Data
  const allowedFoodsEn: FoodCategory[] = [
    { 
      emoji: '🥩', 
      name: 'Meat & Fish', 
      desc: 'Primary protein sources, allowed unless cooked with sugary sauces.',
      items: [
        { name: 'Beef & Lamb', detail: 'Rich in Iron and B12. Choose lean cuts.' },
        { name: 'Chicken & Poultry', detail: 'Excellent protein source. Avoid sugary marinades.' },
        { name: 'Fish (Salmon, Tuna)', detail: 'Rich in Omega-3 fatty acids for heart and brain.' },
        { name: 'Eggs', detail: 'Perfect breakfast, high in protein and healthy fats.' }
      ]
    },
    { 
      emoji: '🥦', 
      name: 'Vegetables', 
      desc: 'The darker the color, the better. Focus on leafy greens.',
      items: [
        { name: 'Leafy Greens', detail: 'Spinach, Arugula, Lettuce. Very low calorie, high fiber.' },
        { name: 'Cruciferous Veg', detail: 'Broccoli, Cauliflower. Great rice/pasta alternatives.' },
        { name: 'Zucchini & Eggplant', detail: 'Versatile for various dishes.' },
        { name: 'Cucumber & Peppers', detail: 'Great snacks full of water and vitamins.' }
      ]
    },
    { 
      emoji: '🍓', 
      name: 'Low Sugar Fruits', 
      desc: 'Allowed in moderation (1-2 servings/day).',
      items: [
        { name: 'Strawberries', detail: 'Lowest sugar content, rich in antioxidants.' },
        { name: 'Berries/Blueberries', detail: 'Immunity boosting and low glycemic index.' },
        { name: 'Kiwi', detail: 'Very rich in Vitamin C and fiber.' },
        { name: 'Avocado', detail: 'Healthy fat fruit, almost zero sugar.' }
      ]
    },
    { 
      emoji: '🥑', 
      name: 'Healthy Fats', 
      desc: 'Essential for satiety when reducing sugar/carbs.',
      items: [
        { name: 'Olive Oil', detail: 'Best for salads and cooking. Heart healthy.' },
        { name: 'Nuts (Almonds, Walnuts)', detail: 'Eat raw and unsalted. A small handful is enough.' },
        { name: 'Natural Butter', detail: 'Animal butter is allowed, avoid margarine.' }
      ]
    },
    { 
      emoji: '🥛', 
      name: 'Dairy', 
      desc: 'Choose full fat and unsweetened varieties.',
      items: [
        { name: 'Greek Yogurt', detail: 'Higher protein and lower sugar than regular yogurt.' },
        { name: 'Hard Cheeses', detail: 'Cheddar, Parmesan. Low lactose.' },
        { name: 'Labneh', detail: 'Excellent option with olive oil and veggies.' }
      ]
    },
    { 
      emoji: '☕', 
      name: 'Beverages', 
      desc: 'Hydration is key to avoiding withdrawal headaches.',
      items: [
        { name: 'Water', detail: 'Drink 2-3 liters daily to flush toxins.' },
        { name: 'Black Coffee', detail: 'Allowed without sugar. Milk splash is okay.' },
        { name: 'Tea & Herbals', detail: 'Green tea, Mint, Ginger. Soothing and beneficial.' }
      ]
    },
  ];

  const forbiddenFoodsEn: FoodCategory[] = [
    { 
      emoji: '🍬', 
      name: 'Sweets & Sugars', 
      desc: 'The #1 enemy. Spikes insulin and causes hunger.',
      items: [
        { name: 'Candy & Chocolate', detail: 'Pure sugar and processed fats.' },
        { name: 'Cakes & Biscuits', detail: 'Mix of sugar and refined white flour.' },
        { name: 'Ice Cream', detail: 'A sugar bomb to be avoided completely.' }
      ]
    },
    { 
      emoji: '🥤', 
      name: 'Sugary Drinks', 
      desc: 'Dangerous because body absorbs them rapidly.',
      items: [
        { name: 'Sodas', detail: 'One can contains about 10 spoons of sugar!' },
        { name: 'Fruit Juices', detail: 'Even "natural" ones lack fiber and are concentrated sugar.' },
        { name: 'Energy Drinks', detail: 'Loaded with sugar and excessive caffeine.' }
      ]
    },
    { 
      emoji: '🍞', 
      name: 'White Carbs', 
      desc: 'Turns to glucose fast, ruining the challenge.',
      items: [
        { name: 'White Bread', detail: 'Spikes blood sugar very quickly.' },
        { name: 'White Rice & Pasta', detail: 'Replace with veggies or small amounts of whole grains.' },
        { name: 'Pastries', detail: 'Combine white flour with unhealthy fats.' }
      ]
    },
    { 
      emoji: '🥫', 
      name: 'Hidden Sugars', 
      desc: 'Products that don\'t look sweet but are full of sugar.',
      items: [
        { name: 'Sauces (Ketchup, BBQ)', detail: 'Ketchup has shocking amounts of sugar.' },
        { name: 'Breakfast Cereals', detail: 'Mostly processed and sugar-coated.' },
        { name: 'Dried Fruits', detail: 'Very high sugar concentration, easy to overeat.' }
      ]
    },
  ];

  const allowedFoods = language === 'ar' ? allowedFoodsAr : allowedFoodsEn;
  const forbiddenFoods = language === 'ar' ? forbiddenFoodsAr : forbiddenFoodsEn;

  const currentList = activeTab === 'allowed' ? allowedFoods : forbiddenFoods;

  return (
    <div className="p-6 pb-24 max-w-md mx-auto h-full flex flex-col">
      <h2 className="text-3xl font-bold text-center text-emerald-800 dark:text-emerald-400 mb-6">{t.guide.title}</h2>
      
      <div className="flex p-1 bg-gray-200 dark:bg-zinc-800 rounded-xl mb-6 transition-colors duration-300 shadow-inner">
        <button
          onClick={() => { setActiveTab('allowed'); setExpandedCategory(null); }}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${
            activeTab === 'allowed'
              ? 'bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300'
          }`}
        >
          {t.guide.allowed}
        </button>
        <button
          onClick={() => { setActiveTab('forbidden'); setExpandedCategory(null); }}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${
            activeTab === 'forbidden'
              ? 'bg-white dark:bg-zinc-700 text-red-500 dark:text-red-400 shadow-sm'
              : 'text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300'
          }`}
        >
          {t.guide.forbidden}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <div className="space-y-3">
          {currentList.map((category, idx) => {
            const isExpanded = expandedCategory === idx;
            
            return (
              <div 
                key={idx} 
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isExpanded 
                    ? activeTab === 'allowed' 
                      ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                      : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                    : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800'
                }`}
              >
                {/* Category Header */}
                <button 
                  onClick={() => toggleCategory(idx)}
                  className={`w-full flex items-center p-4 focus:outline-none ${language === 'ar' ? 'text-right' : 'text-left'}`}
                >
                  <span className={`text-3xl ${language === 'ar' ? 'ml-4' : 'mr-4'}`}>{category.emoji}</span>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${
                      activeTab === 'allowed' 
                        ? 'text-emerald-900 dark:text-emerald-200' 
                        : 'text-red-900 dark:text-red-200'
                    }`}>
                      {category.name}
                    </h3>
                    {!isExpanded && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[200px]">
                        {category.desc}
                      </p>
                    )}
                  </div>
                  <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <svg className={`w-5 h-5 ${activeTab === 'allowed' ? 'text-emerald-500' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </button>

                {/* Expanded Content (Sub-items) */}
                <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 bg-white/50 dark:bg-black/20 p-2 rounded-lg border border-gray-100 dark:border-zinc-700/50">
                      {t.guide.tip} {category.desc}
                    </p>
                    
                    <div className="space-y-2">
                      {category.items.map((item, itemIdx) => {
                         const isItemExpanded = expandedItem === item.name;
                         return (
                          <div key={itemIdx} className="overflow-hidden">
                            <button 
                              onClick={() => toggleItem(item.name)}
                              className={`w-full flex justify-between items-center p-3 rounded-xl text-sm font-bold transition-colors ${
                                activeTab === 'allowed'
                                  ? 'bg-white dark:bg-zinc-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                                  : 'bg-white dark:bg-zinc-800 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-current opacity-50"></span>
                                {item.name}
                              </div>
                              <span className="text-xs opacity-60">
                                {isItemExpanded ? '▲' : '▼'}
                              </span>
                            </button>
                            
                            {/* Item Details */}
                            <div className={`transition-all duration-200 overflow-hidden ${isItemExpanded ? 'max-h-24 mt-1 mb-2' : 'max-h-0'}`}>
                               <div className={`text-xs p-3 rounded-lg mx-1 leading-relaxed ${
                                 activeTab === 'allowed'
                                   ? 'bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100'
                                   : 'bg-red-100/50 dark:bg-red-900/30 text-red-900 dark:text-red-100'
                               }`}>
                                 {item.detail}
                               </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FoodGuide;