import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { IdeaCard } from './components/IdeaCard';
import { IdeaModal } from './components/IdeaModal';
import { SearchBar } from './components/SearchBar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Idea, IdeaFormData } from './types';
import { Plus, Lightbulb } from 'lucide-react';

function App() {
  const [ideas, setIdeas] = useLocalStorage<Idea[]>('future-ideas', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(ideas.map(idea => idea.category).filter(Boolean)));
    return uniqueCategories.sort();
  }, [ideas]);

  const filteredIdeas = useMemo(() => {
    return ideas.filter(idea => {
      const matchesSearch = searchTerm === '' || 
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === '' || idea.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [ideas, searchTerm, selectedCategory]);

  const handleSaveIdea = (formData: IdeaFormData) => {
    const now = new Date();
    
    if (editingIdea) {
      setIdeas(prev => prev.map(idea => 
        idea.id === editingIdea.id 
          ? { ...idea, ...formData, updatedAt: now }
          : idea
      ));
      setEditingIdea(null);
    } else {
      const newIdea: Idea = {
        id: crypto.randomUUID(),
        ...formData,
        checklist: formData.checklist || [],
        createdAt: now,
        updatedAt: now
      };
      setIdeas(prev => [newIdea, ...prev]);
    }
  };

  const handleEditIdea = (idea: Idea) => {
    setEditingIdea(idea);
    setIsModalOpen(true);
  };

  const handleDeleteIdea = (id: string) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      setIdeas(prev => prev.filter(idea => idea.id !== id));
    }
  };

  const handleToggleChecklistItem = (ideaId: string, itemId: string) => {
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId 
        ? {
            ...idea,
            checklist: idea.checklist.map(item =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            ),
            updatedAt: new Date()
          }
        : idea
    ));
  };

  const handleAddIdea = () => {
    setEditingIdea(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-gray-100">
      <Header onAddIdea={handleAddIdea} totalIdeas={ideas.length} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

        {filteredIdeas.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg max-w-md mx-auto">
              <Lightbulb className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {ideas.length === 0 ? "No ideas yet!" : "No matching ideas"}
              </h3>
              <p className="text-gray-600 mb-6">
                {ideas.length === 0 
                  ? "Start capturing your brilliant ideas and turn them into reality."
                  : "Try adjusting your search or category filter."
                }
              </p>
              {ideas.length === 0 && (
                <button
                  onClick={handleAddIdea}
                  className="bg-gradient-to-r from-black to-gray-800 text-yellow-400 px-6 py-3 rounded-lg hover:from-gray-800 hover:to-black transition-all flex items-center space-x-2 mx-auto font-semibold"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Your First Idea</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea, index) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onEdit={handleEditIdea}
                onDelete={handleDeleteIdea}
                onToggleChecklistItem={handleToggleChecklistItem}
                serialNumber={ideas.findIndex(originalIdea => originalIdea.id === idea.id) + 1}
              />
            ))}
          </div>
        )}
      </main>

      <IdeaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIdea(null);
        }}
        onSave={handleSaveIdea}
        editingIdea={editingIdea}
      />

      {/* Floating Action Button for Mobile */}
      <button
        onClick={handleAddIdea}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-black to-gray-800 text-yellow-400 p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 md:hidden"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}

export default App;