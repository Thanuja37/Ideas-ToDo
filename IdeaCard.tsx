import React from 'react';
import { Edit3, Trash2, Clock, Tag, AlertCircle, CheckSquare, Square } from 'lucide-react';
import { Idea } from '../types';

interface IdeaCardProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
  onToggleChecklistItem: (ideaId: string, itemId: string) => void;
  serialNumber: number;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ 
  idea, 
  onEdit, 
  onDelete, 
  onToggleChecklistItem,
  serialNumber 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const completedTasks = idea.checklist.filter(item => item.completed).length;
  const totalTasks = idea.checklist.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 relative">
      {/* Serial Number Badge */}
      <div className="absolute top-4 left-4 bg-gradient-to-r from-black to-gray-800 text-yellow-400 text-sm font-bold px-3 py-1 rounded-full shadow-lg z-10">
        #{serialNumber}
      </div>
      
      <div className="p-6 pt-12">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2 pr-4">
            {idea.title}
          </h3>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(idea)}
              className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(idea.id)}
              className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-pink-500" />
              Description
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {idea.description}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Resources</h4>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {idea.resources}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">How to Do</h4>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {idea.howToDo}
            </p>
          </div>

          {/* Checklist Section */}
          {idea.checklist.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-700 flex items-center">
                  <CheckSquare className="h-4 w-4 mr-2 text-yellow-600" />
                  Checklist
                </h4>
                <div className="text-xs text-gray-500">
                  {completedTasks}/{totalTasks} completed
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              {/* Checklist Items (show first 3) */}
              <div className="space-y-2">
                {idea.checklist.slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <button
                      onClick={() => onToggleChecklistItem(idea.id, item.id)}
                      className="flex-shrink-0 transition-colors"
                    >
                      {item.completed ? (
                        <CheckSquare className="h-4 w-4 text-green-600" />
                      ) : (
                        <Square className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                    <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
                {idea.checklist.length > 3 && (
                  <div className="text-xs text-gray-500 pl-6">
                    +{idea.checklist.length - 3} more items...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(idea.priority)}`}>
              {idea.priority.charAt(0).toUpperCase() + idea.priority.slice(1)}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-black text-yellow-400 border border-gray-800">
              <Tag className="h-3 w-3 mr-1" />
              {idea.category}
            </span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {formatDate(idea.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};