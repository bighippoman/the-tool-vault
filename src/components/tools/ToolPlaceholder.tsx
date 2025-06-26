interface ToolPlaceholderProps {
  toolId: string;
}

const ToolPlaceholder = ({ toolId }: ToolPlaceholderProps) => {
  return (
    <div className="text-center py-8">
      <h3 className="text-lg font-semibold mb-2">Coming Soon!</h3>
      <p className="text-muted-foreground mb-4">
        We&apos;re working hard to bring you this amazing tool. It&apos;ll be available soon!
      </p>
      <p className="text-sm text-muted-foreground">
        In the meantime, check out our other tools or let us know what features you&apos;d like to see.
      </p>
      <p className="text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 p-3 rounded-md inline-block">
        Tool ID: {toolId}
      </p>
    </div>
  );
};

export default ToolPlaceholder;
