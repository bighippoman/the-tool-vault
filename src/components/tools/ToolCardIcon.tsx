import ToolIcon from './ToolIcon';

interface ToolCardIconProps {
  category: string;
}

const ToolCardIcon = ({ category }: ToolCardIconProps) => {
  return (
    <div className="flex-shrink-0">
      <ToolIcon 
        category={category}
        className="transition-transform duration-200 group-hover:scale-105 w-10 h-10"
      />
    </div>
  );
};

export default ToolCardIcon;
