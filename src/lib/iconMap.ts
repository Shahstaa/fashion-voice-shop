import { 
  Shirt, 
  User, 
  Baby, 
  Footprints, 
  Watch, 
  Tag, 
  Package, 
  Scissors, 
  Zap,
  LucideIcon
} from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  'Shirt': Shirt,
  'User': User,
  'Baby': Baby,
  'Footprints': Footprints,
  'Watch': Watch,
  'Tag': Tag,
  'Package': Package,
  'Scissors': Scissors,
  'Zap': Zap
};

export const getIcon = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Shirt; // Default to Shirt if icon not found
};
