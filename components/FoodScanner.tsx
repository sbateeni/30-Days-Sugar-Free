import React, { useState, useRef } from 'react';
import { analyzeFoodImage, analyzeFoodText } from '../services/geminiService';
import { FoodAnalysis } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const FoodScanner: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language, t } = useLanguage();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix for API
        const base64Data = base64String.split(',')[1];
        setImage(base64String);
        performImageAnalysis(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    setError(null);
    setImage(null); // Clear image if switching to text mode

    try {
      const analysis = await analyzeFoodText(textInput, language);
      setResult(analysis);
    } catch (err) {
      setError(t.scanner.error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performImageAnalysis = async (base64Data: string) => {
    setIsAnalyzing(true);
    setResult(null);
    setError(null);
    try {
      const analysis = await analyzeFoodImage(base64Data, language);
      setResult(analysis);
    } catch (err) {
      setError(t.scanner.error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  const resetScanner = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setTextInput('');
  };

  const hasContent = image || result || isAnalyzing;

  return (
    <div className="p-6 pb-24 max-w-md mx-auto h-full overflow-y-auto">
      <h2 className="text-3xl font-bold text-center text-emerald-800 dark:text-emerald-400 mb-6">{t.scanner.title}</h2>
      
      {!hasContent ? (
        <div className="space-y-8 animate-fade-in-up">
          {/* Image Section */}
          <div className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-3xl bg-emerald-50/50 dark:bg-zinc-900 hover:bg-emerald-50 dark:hover:bg-zinc-800 transition-colors">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                📷
              </div>
              <p className="text-emerald-800 dark:text-emerald-400 font-medium mb-4">{t.scanner.placeholder}</p>
              <button 
                onClick={triggerCamera}
                className="bg-emerald-600 dark:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-transform active:scale-95"
              >
                {t.scanner.cameraBtn}
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-zinc-700"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 dark:text-gray-500 text-sm">{t.scanner.orSearch}</span>
            <div className="flex-grow border-t border-gray-300 dark:border-zinc-700"></div>
          </div>

          {/* Text Input Section */}
          <form onSubmit={handleTextSubmit} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800">
             <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2 text-sm" htmlFor="foodName">
               {t.scanner.label}
             </label>
             <div className="flex gap-2">
               <input 
                 type="text"
                 id="foodName"
                 value={textInput}
                 onChange={(e) => setTextInput(e.target.value)}
                 placeholder={t.scanner.inputPlaceholder}
                 className="flex-1 p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 dark:text-gray-100 placeholder-gray-400"
               />
               <button 
                 type="submit"
                 disabled={!textInput.trim()}
                 className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl font-bold hover:bg-emerald-200 dark:hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               >
                 {t.scanner.analyzeBtn}
               </button>
             </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active View (Image or Placeholder) */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-zinc-700">
            {image ? (
              <img src={image} alt="Food" className="w-full h-64 object-cover" />
            ) : (
              <div className="w-full h-40 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
                 <div className="text-center">
                    <span className="text-4xl block mb-2">🍽️</span>
                    <span className="text-emerald-800 dark:text-emerald-400 font-bold">{textInput || t.scanner.defaultText}</span>
                 </div>
              </div>
            )}
            
            <button 
              onClick={resetScanner}
              className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/70"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {isAnalyzing && (
            <div className="text-center py-8 animate-pulse">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-emerald-700 dark:text-emerald-400 font-medium">{t.scanner.analyzing}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800 text-center">
              {error}
            </div>
          )}

          {result && (
            <div className={`rounded-2xl p-6 shadow-md border animate-fade-in-up transition-colors duration-300 ${
              result.isCompliant 
                ? 'bg-white dark:bg-zinc-900 border-emerald-200 dark:border-emerald-900' 
                : 'bg-white dark:bg-zinc-900 border-red-200 dark:border-red-900'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{result.foodName}</h3>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold mt-2 ${
                    result.isCompliant 
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' 
                      : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                  }`}>
                    {result.isCompliant ? t.scanner.compliant : t.scanner.forbidden}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg">
                  {result.explanation}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl border border-orange-100 dark:border-orange-800/50">
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-bold mb-1">{t.scanner.sugar}</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{result.sugarPercentage}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800/50">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-1">{t.scanner.calories}</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{result.macros.calories}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4">
                <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3 text-sm">{t.scanner.nutrition}</h4>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">{t.scanner.macros.p}</div>
                    <div className="font-bold text-gray-800 dark:text-gray-200">{result.macros.protein}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">{t.scanner.macros.c}</div>
                    <div className="font-bold text-gray-800 dark:text-gray-200">{result.macros.carbs}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">{t.scanner.macros.f}</div>
                    <div className="font-bold text-gray-800 dark:text-gray-200">{result.macros.fats}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FoodScanner;