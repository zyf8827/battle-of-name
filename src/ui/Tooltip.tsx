import { ReactNode } from 'react';

type TooltipProps = {
  children: ReactNode;
  content: ReactNode;
  className?: string;
};

export function Tooltip({ children, content, className = '' }: TooltipProps) {
  if (!content) return <>{children}</>;

  return (
    <div className={`group relative inline-flex ${className}`}>
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-xs -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-2 text-xs text-slate-200 shadow-xl backdrop-blur-sm">
          {content}
        </div>
        {/* Arrow */}
        <div className="absolute -bottom-1 left-1/2 -ml-1 h-2 w-2 rotate-45 border-b border-r border-slate-700 bg-slate-900/95"></div>
      </div>
    </div>
  );
}
