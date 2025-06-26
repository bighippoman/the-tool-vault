
interface ToolCardHeaderProps {
  name: string;
  isNew?: boolean;
  isPopular?: boolean;
}

const ToolCardHeader = ({ name }: ToolCardHeaderProps) => {
  return (
    <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2">
      {name}
    </h3>
  );
};

export default ToolCardHeader;
