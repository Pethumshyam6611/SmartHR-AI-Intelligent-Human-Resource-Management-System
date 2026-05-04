interface DividerProps {
  className?: string;
  text?: string;
}

export function Divider({ className = '', text }: DividerProps) {
  if (text) {
    return (
      <div className={`flex items-center gap-4 my-4 ${className}`}>
        <div className="flex-1 border-t border-border" />
        <span className="text-sm text-text-tertiary">{text}</span>
        <div className="flex-1 border-t border-border" />
      </div>
    );
  }

  return <div className={`divider ${className}`} />;
}
