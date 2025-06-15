import React, { useState, useEffect } from 'react';
import { X, Save, Lightbulb, Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { Idea, IdeaFormData, ChecklistItem } from '../types';

interface IdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: IdeaFormData) => void;
  editingIdea?: Idea | null;
}

export const IdeaModal: React.FC<IdeaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingIdea
}) => {
  const [formData, setFormData] = useState<IdeaFormData>({
    title: '',
    description: '',
    resources: '',
    howToDo: '',
    category: '',
    priority: 'medium',
    checklist: []
  });

  const [newChecklistItem, setNewChecklistItem] = useState('');

  useEffect(() => {
    if (editingIdea) {
      setFormData({
        title: editingIdea.title,
        description: editingIdea.description,
        resources: editingIdea.resources,
        howToDo: editingIdea.howToDo,
        category: editingIdea.category,
        priority: editingIdea.priority,
        checklist: editingIdea.checklist || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        resources: '',
        howToDo: '',
        category: '',
        priority: 'medium',
        checklist: []
      });
    }
    setNewChecklistItem('');
  }, [editingIdea, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof IdeaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem: ChecklistItem = {
        id: crypto.randomUUID(),
        text: newChecklistItem.trim(),
        completed: false
      };
      setFormData(prev => ({
        ...prev,
        checklist: [...prev.checklist, newItem]
      }));
      setNewChecklistItem('');
    }
  };

  const removeChecklistItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter(item => item.id !== itemId)
    }));
  };

  const toggleChecklistItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addChecklistItem();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-black to-gray-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-400 p-2 rounded-full">
                <Lightbulb className="h-5 w-5 text-black" />
              </div>
              <h2 className="text-xl font-semibold text-yellow-400">
                {editingIdea ? 'Edit Idea' : 'Add New Idea'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-pink-300 hover:text-pink-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                placeholder="Enter your idea title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                placeholder="e.g., Tech, Business, Creative..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value as 'low' | 'medium' | 'high')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe your idea in detail..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resources
            </label>
            <textarea
              value={formData.resources}
              onChange={(e) => handleChange('resources', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
              placeholder="What resources do you need? (tools, people, money, time...)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How to Do It
            </label>
            <textarea
              value={formData.howToDo}
              onChange={(e) => handleChange('howToDo', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
              placeholder="Step-by-step plan or approach to implement this idea..."
            />
          </div>

          {/* Checklist Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <CheckSquare className="h-4 w-4 mr-2 text-yellow-600" />
              Checklist
            </label>
            
            {/* Add new checklist item */}
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                placeholder="Add a checklist item..."
              />
              <button
                type="button"
                onClick={addChecklistItem}
                className="px-4 py-2 bg-gradient-to-r from-black to-gray-800 text-yellow-400 rounded-lg hover:from-gray-800 hover:to-black transition-all flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Checklist items */}
            {formData.checklist.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {formData.checklist.map(item => (
                  <div key={item.id} className="flex items-center space-x-2 group">
                    <button
                      type="button"
                      onClick={() => toggleChecklistItem(item.id)}
                      className="flex-shrink-0 transition-colors"
                    >
                      {item.completed ? (
                        <CheckSquare className="h-4 w-4 text-green-600" />
                      ) : (
                        <Square className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                    <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {item.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeChecklistItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-black to-gray-800 text-yellow-400 rounded-lg hover:from-gray-800 hover:to-black transition-all flex items-center space-x-2 font-semibold"
            >
              <Save className="h-4 w-4" />
              <span>{editingIdea ? 'Update' : 'Save'} Idea</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};