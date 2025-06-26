
export type ToolCategory = 
  | 'development' 
  | 'design' 
  | 'productivity' 
  | 'marketing' 
  | 'finance' 
  | 'chatbots'
  | 'utility'
  | 'health' 
  | 'education';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  path: string;
  isPopular?: boolean;
  isNew?: boolean;
  tags?: string[];
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  color: string;
  bgClass: string;
  iconClass: string;
}

export type VocabularyDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
