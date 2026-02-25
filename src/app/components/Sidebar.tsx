import React from 'react';
import { Home, Compass, Heart, Users, Settings, LogOut, ChefHat } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'discover', icon: Compass, label: 'Discover' },
    { id: 'feed', icon: Home, label: 'My Feed' },
    { id: 'favorites', icon: Heart, label: 'Favorites' },
    { id: 'community', icon: Users, label: 'Community' },
  ];

  return (
    <div className="h-screen w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex-col hidden md:flex sticky top-0">
      <div className="p-6 flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
        <ChefHat className="w-8 h-8" />
        <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-100">Culinara</span>
      </div>

      <div className="flex-1 px-4 py-2 space-y-1">
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-3 mb-2 mt-2">Menu</div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === item.id 
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}

        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-3 mb-2 mt-8">Preferences</div>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
};
