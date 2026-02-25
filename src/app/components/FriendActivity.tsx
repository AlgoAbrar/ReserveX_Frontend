import React from 'react';
import { User, Activity, TrendingUp } from 'lucide-react';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  action: string;
  recipeName: string;
  timeAgo: string;
}

interface FriendActivityProps {
  friends: Friend[];
}

export const FriendActivity: React.FC<FriendActivityProps> = ({ friends }) => {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 sticky top-4">
      <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-zinc-100">
        <TrendingUp className="w-5 h-5 text-indigo-500" />
        <h3 className="font-bold text-lg">Friend Activity</h3>
      </div>
      
      <div className="space-y-4">
        {friends.map((friend) => (
          <div key={friend.id} className="flex items-start gap-3 group">
            <div className="relative flex-shrink-0">
              <img 
                src={friend.avatar} 
                alt={friend.name} 
                className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-zinc-800 shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900"></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-900 dark:text-zinc-100 font-medium truncate">
                {friend.name}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">{friend.action}</span> {friend.recipeName}
              </p>
              <p className="text-[10px] text-zinc-400 mt-1">{friend.timeAgo}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-2 px-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors">
        Find more friends
      </button>
    </div>
  );
};
