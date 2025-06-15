import React from 'react';
import { Plus, Lightbulb } from 'lucide-react';

interface HeaderProps {
  onAddIdea: () => void;
  totalIdeas: number;
}

export const Header: React.FC<HeaderProps> = ({ onAddIdea, totalIdeas }) => {
  return (
    <header className="bg-gradient-to-r from-black via-gray-900 to-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-400 p-3 rounded-full">
              <Lightbulb className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-yellow-400">Future Ideas</h1>
              <p className="text-pink-300 mt-1">
                Capture and nurture your brilliant concepts
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-pink-300">Total Ideas</p>
              <p className="text-2xl font-bold text-yellow-400">{totalIdeas}</p>
            </div>
            <button
              onClick={onAddIdea}
              className="bg-yellow-400 hover:bg-yellow-500 text-black p-3 rounded-full transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};