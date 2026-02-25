import React from 'react';
import { X, Clock, Users, Flame, ChevronRight, Share2, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Recipe {
  id: string;
  title: string;
  image: string;
  chef: string;
  time: string;
  difficulty: string;
  rating: number;
  tags: string[];
  ingredients: string[];
  steps: string[];
  calories?: number;
  servings?: number;
  description?: string;
}

interface RecipeDetailProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Close Button Mobile */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full md:hidden backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image Section */}
          <div className="w-full md:w-2/5 h-64 md:h-auto relative">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
            <div className="absolute bottom-4 left-4 md:hidden text-white">
              <h2 className="text-2xl font-bold">{recipe.title}</h2>
              <p className="opacity-90">by {recipe.chef}</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="hidden md:flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{recipe.title}</h2>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-lg">by <span className="text-indigo-600 dark:text-indigo-400 font-medium">{recipe.chef}</span></p>
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
                <button 
                  onClick={onClose}
                  className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-zinc-600 dark:text-zinc-300 mb-8 leading-relaxed">
              {recipe.description || "A delicious homemade recipe that brings comfort and joy to your table. Perfect for any occasion and loved by everyone who tries it."}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                <Clock className="w-6 h-6 text-orange-500 mb-2" />
                <span className="text-xs uppercase font-bold text-orange-400 tracking-wider">Time</span>
                <span className="font-semibold text-zinc-700 dark:text-zinc-200">{recipe.time}</span>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                <Users className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">Serves</span>
                <span className="font-semibold text-zinc-700 dark:text-zinc-200">{recipe.servings || 4} ppl</span>
              </div>
              <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                <Flame className="w-6 h-6 text-red-500 mb-2" />
                <span className="text-xs uppercase font-bold text-red-400 tracking-wider">Calories</span>
                <span className="font-semibold text-zinc-700 dark:text-zinc-200">{recipe.calories || 450} kcal</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Ingredients */}
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                  Ingredients
                  <span className="text-xs font-normal text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
                    {recipe.ingredients.length} items
                  </span>
                </h3>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <li key={idx} className="flex items-start gap-3 group">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0 group-hover:scale-150 transition-transform" />
                      <span className="text-zinc-700 dark:text-zinc-300 leading-relaxed group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                        {ingredient}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps (Abbreviated for this view, or we can show full) */}
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Instructions</h3>
                <div className="space-y-6">
                  {recipe.steps.map((step, idx) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 border-2 border-indigo-500 flex items-center justify-center">
                      </div>
                      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-1">Step {idx + 1}</p>
                      <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              Start Cooking Now <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
