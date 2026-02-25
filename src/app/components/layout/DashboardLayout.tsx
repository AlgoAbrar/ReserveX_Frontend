import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  UtensilsCrossed, 
  LogOut, 
  Settings, 
  Users, 
  ClipboardList,
  Bell,
  Search,
  ChefHat,
  CreditCard,
  Heart
} from 'lucide-react';
import { USERS } from '../../data/mockData';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: 'customer' | 'manager' | 'admin';
  onNavigate: (page: string) => void;
  currentPage: string;
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  userType, 
  onNavigate, 
  currentPage,
  onLogout 
}) => {
  const user = USERS.find(u => u.role === userType) || USERS[0];

  const getMenuItems = () => {
    switch (userType) {
      case 'customer':
        return [
          { id: 'customer-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'customer-reservations', label: 'My Reservations', icon: CalendarDays },
          { id: 'customer-favorites', label: 'Favorites', icon: Heart },
          { id: 'listings', label: 'Explore Restaurants', icon: UtensilsCrossed }, // Redirects to public listing but keeps auth
          { id: 'customer-profile', label: 'Profile', icon: Settings },
        ];
      case 'manager':
        return [
          { id: 'manager-dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'manager-reservations', label: 'Reservations', icon: ClipboardList },
          { id: 'manager-tables', label: 'Table Management', icon: Users },
          { id: 'manager-settings', label: 'Restaurant Settings', icon: Settings },
        ];
      case 'admin':
        return [
          { id: 'admin-dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'admin-users', label: 'User Management', icon: Users },
          { id: 'admin-restaurants', label: 'Restaurants', icon: ChefHat },
          { id: 'admin-complaints', label: 'Complaints', icon: Bell },
          { id: 'admin-settings', label: 'Settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#e0e0e0] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#161616] border-r border-[#2a2a2a] flex-shrink-0 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-[#2a2a2a]">
           <div className="w-8 h-8 bg-[#d4af37] rounded-sm flex items-center justify-center mr-3">
              <span className="text-black font-serif font-bold text-xl">R</span>
           </div>
          <span className="font-serif text-2xl font-bold tracking-wide text-white">ReserveX</span>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-4">Main Menu</p>
            <nav className="space-y-1">
              {getMenuItems().map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === item.id 
                      ? 'bg-[#d4af37]/10 text-[#d4af37] border-l-2 border-[#d4af37]' 
                      : 'text-zinc-400 hover:bg-[#222] hover:text-zinc-200'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${currentPage === item.id ? 'text-[#d4af37]' : 'text-zinc-500'}`} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto pt-8 border-t border-[#2a2a2a]">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-[#161616] border-b border-[#2a2a2a] flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 text-sm text-zinc-400">
             <span className="hidden sm:inline">Welcome back,</span> 
             <span className="font-bold text-white text-lg">{user.name}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-[#0a0a0a] border border-[#333] rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#d4af37] w-64 text-zinc-300"
              />
            </div>
            <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#d4af37] rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-[#333]">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-10 h-10 rounded-full object-cover border-2 border-[#d4af37]/50"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-[#0f0f0f] to-[#141414]">
          {children}
        </main>
      </div>
    </div>
  );
};
