import { getToolIcon } from '@/utils/toolIconMap';

interface ToolIconProps {
  category: string;
  className?: string;
}

const ToolIcon = ({ category, className = '' }: ToolIconProps) => {
  const IconComponent = getToolIcon('default', category);
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32
  };

  const containerClasses = `${sizeClasses['md']} rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative ${className}`;

  return (
    <div className={containerClasses}>
      <IconComponent 
        size={iconSizes['md']} 
        className="text-white drop-shadow-sm" 
        strokeWidth={1.5}
      />
    </div>
  );
};

export default ToolIcon;
