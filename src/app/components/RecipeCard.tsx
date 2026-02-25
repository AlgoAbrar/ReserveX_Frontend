import React from 'react';
import { Clock, ChefHat, Star, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface Recipe {
  id: string;
  title: string;
  image: string;
  chef: string;
  time: string;
  difficulty: string;
  rating: number;
  tags: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-zinc-200 dark:border-zinc-800 cursor-pointer transition-all"
      onClick={() => onClick(recipe)}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/70 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
          <Heart className="w-4 h-4 text-rose-500" />
        </div>
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md">
          <div className="flex items-center gap-1 text-xs font-medium text-white">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{recipe.rating}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 line-clamp-1">{recipe.title}</h3>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          <ChefHat className="w-4 h-4" />
          <span className="truncate">by {recipe.chef}</span>
        </div>

        <div className="flex items-center justify-between mt-4 text-xs font-medium text-zinc-600 dark:text-zinc-300">
          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            <span>{recipe.time}</span>
          </div>
          <span className={`px-2 py-1 rounded-md ${
            recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            recipe.difficulty === 'Medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
