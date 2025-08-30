import { Globe, Moon, Sun } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/contexts/ThemeContext';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-foreground" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
          className="text-sm bg-transparent border-none outline-none cursor-pointer text-foreground hover:text-purple-600 dark:hover:text-purple-400"
        >
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </div>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-foreground" />
        ) : (
          <Moon className="w-5 h-5 text-foreground" />
        )}
      </button>
    </div>
  );
};
