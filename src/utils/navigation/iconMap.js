import {
  Brain,
  TrendingUp,
  MessageSquare,
  Eye,
  Glasses,
  Globe,
  Monitor,
  Palette,
  Cloud,
  Settings,
  Headphones,
  Target,
  Lightbulb,
  Server,
  Puzzle,
  PenTool,
  Lock,
  FileText,
  GitBranch,
} from "lucide-react";

/**
 * Icon mapping for capability items
 * Maps string identifiers to Lucide React icon components
 */
export const iconMap = {
  Brain,
  TrendingUp,
  MessageSquare,
  Eye,
  Glasses,
  Globe,
  Monitor,
  Palette,
  Cloud,
  Settings,
  Headphones,
  Target,
  Lightbulb,
  Server,
  Puzzle,
  PenTool,
  Lock,
  FileText,
  GitBranch,
};

/**
 * Get icon component by string name
 * @param {string} iconName - Name of the icon
 * @returns {React.Component|null} - Icon component or null
 */
export function getIconComponent(iconName) {
  return iconMap[iconName] || null;
}
