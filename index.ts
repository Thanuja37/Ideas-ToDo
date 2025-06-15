export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  resources: string;
  howToDo: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  checklist: ChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IdeaFormData {
  title: string;
  description: string;
  resources: string;
  howToDo: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  checklist: ChecklistItem[];
}