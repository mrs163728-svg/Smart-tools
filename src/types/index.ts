export type ToolCategory =
  | 'calculators'
  | 'text'
  | 'image'
  | 'pdf'
  | 'developer'
  | 'converters';

export interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  icon: string;
  popular?: boolean;
  featured?: boolean;
  keywords: string[];
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  count: number;
}
