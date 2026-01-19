import React, { useState, useEffect } from 'react';
import { DayStatus, UserProfile } from '../types';
import confetti from 'canvas-confetti';
import { useLanguage } from '../contexts/LanguageContext';

const TOTAL_DAYS = 30;

const ChallengeTracker: React.FC = () => {
  const [days, setDays] = useState<DayStatus[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const { t } = useLanguage();
  
  // Profile State
  const [profile, setProfile] = useState<UserProfile>({
    height: '',
    startWeight: '',
    currentWeight: ''
  });
  const [isEditingWeight, setIsEditingWeight] = useState(false);

  useEffect(() => {
    // Load Days
    const storedDays = localStorage.getItem('sugarFreeDays');
    if (storedDays) {
      const parsedDays = JSON.parse(storedDays);
      setDays(parsedDays);
      setCompletedCount(parsedDays.filter((d: DayStatus) => d.completed).length);
    } else {
      const initialDays = Array.from({ length: TOTAL_DAYS }, (_, i) => ({
        day: i + 1,
        completed: false,
      }));
      setDays(initialDays);
      setCompletedCount(0);
    }

    // Load Profile
    const storedProfile = localStorage.getItem('sugarFreeProfile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('sugarFreeProfile', JSON.stringify(newProfile));
  };

  const handleStartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // When starting, current weight is same as start weight
    saveProfile({
      ...profile,
      currentWeight: profile.startWeight
    });
  };

  const handleUpdateWeight = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(profile);
    setIsEditingWeight(false);
  };

  const toggleDay = (index: number) => {
    const newDays = [...days];
    const isNowCompleted = !newDays[index].completed;
    newDays[index].completed = isNowCompleted;
    
    setDays(newDays);
    setCompletedCount(newDays.filter(d => d.completed).length);
    localStorage.setItem('sugarFreeDays', JSON.stringify(newDays));

    if (isNowCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const progressPercentage = Math.round((completedCount / TOTAL_DAYS) * 100);

  // Helper to calculate difference
  const weightDiff = profile.startWeight && profile.currentWeight 
    ? (parseFloat(profile.currentWeight) - parseFloat(profile.startWeight)).toFixed(1)
    : '0';
  
  const isLoss = parseFloat(weightDiff) < 0;

  return (
    <div className="p-6 pb-24 max-w-md mx-auto h-full overflow-y-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-emerald-800 dark:text-emerald-400 mb-2">{t.tracker.title}</h2>
        <p className="text-gray-600 dark:text-gray-400">{t.tracker.subtitle}</p>
      </div>

      {/* Body Stats Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-emerald-100 dark:border-zinc-800 p-5 mb-6 transition-colors duration-300">
        {!profile.startWeight ? (
          // Setup Form
          <form onSubmit={handleStartSubmit} className="animate-fade-in-up">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">{t.tracker.setupTitle}</h3>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t.tracker.weight}</label>
                <input
                  type="number"
                  required
                  placeholder="0.0"
                  className="w-full p-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:border-emerald-500 text-center dark:text-white"
                  value={profile.startWeight}
                  onChange={(e) => setProfile({ ...profile, startWeight: e.target.value })}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t.tracker.height}</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  className="w-full p-2 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:border-emerald-500 text-center dark:text-white"
                  value={profile.height}
                  onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-xl transition-colors shadow-emerald-200 dark:shadow-none shadow-md"
            >
              {t.tracker.saveStart}
            </button>
          </form>
        ) : (
          // Stats Dashboard
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
              <h3 className="font-bold text-gray-800 dark:text-gray-200">{t.tracker.statsTitle}</h3>
              <button 
                onClick={() => setIsEditingWeight(!isEditingWeight)}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
              >
                {isEditingWeight ? t.tracker.cancel : t.tracker.updateWeight}
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-zinc-800">
                <span className="block text-xs text-gray-500 dark:text-gray-400">{t.tracker.start}</span>
                <span className="font-bold text-lg text-gray-800 dark:text-gray-100">{profile.startWeight} <span className="text-xs font-normal">kg</span></span>
              </div>
              
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                <span className="block text-xs text-gray-500 dark:text-gray-400">{t.tracker.current}</span>
                {isEditingWeight ? (
                  <form onSubmit={handleUpdateWeight} className="flex items-center justify-center mt-1">
                    <input
                      type="number"
                      autoFocus
                      className="w-16 p-0 text-center bg-white dark:bg-zinc-700 rounded border border-emerald-300 dark:border-emerald-700 text-sm font-bold dark:text-white"
                      value={profile.currentWeight}
                      onChange={(e) => setProfile({ ...profile, currentWeight: e.target.value })}
                      onBlur={() => {
                        if(profile.currentWeight) {
                          saveProfile(profile);
                          setIsEditingWeight(false);
                        }
                      }}
                    />
                  </form>
                ) : (
                  <span 
                    onClick={() => setIsEditingWeight(true)}
                    className="font-bold text-lg text-emerald-700 dark:text-emerald-300 cursor-pointer"
                  >
                    {profile.currentWeight} <span className="text-xs font-normal">kg</span>
                  </span>
                )}
              </div>

              <div className={`p-2 rounded-lg ${isLoss ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                <span className="block text-xs text-gray-500 dark:text-gray-400">{t.tracker.result}</span>
                <span className={`font-bold text-lg ${isLoss ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  {parseFloat(weightDiff) > 0 ? '+' : ''}{weightDiff} <span className="text-xs font-normal">kg</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm p-6 mb-8 border border-emerald-100 dark:border-zinc-800 transition-colors duration-300">
        <div className="flex justify-between items-end mb-4">
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{progressPercentage}%</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{completedCount} {t.tracker.completedDays}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-emerald-500 dark:bg-emerald-600 h-3 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {days.map((dayItem, index) => (
          <button
            key={dayItem.day}
            onClick={() => toggleDay(index)}
            className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 border ${
              dayItem.completed
                ? 'bg-emerald-500 dark:bg-emerald-600 text-white shadow-emerald-200 dark:shadow-none shadow-lg border-emerald-500 dark:border-emerald-600'
                : 'bg-white dark:bg-zinc-900 text-gray-400 dark:text-zinc-600 border-gray-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700'
            }`}
          >
            <span className={`text-sm font-bold ${dayItem.completed ? 'opacity-100' : 'opacity-70'}`}>
              {dayItem.day}
            </span>
            {dayItem.completed && (
              <svg className="w-4 h-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChallengeTracker;