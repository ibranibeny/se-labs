import type { CSSProperties, ReactNode } from 'react';

/** Convert a solid hex color into a soft tinted background style. */
export function softStyle(color: string): CSSProperties {
  return { backgroundColor: `${color}1f`, color };
}

interface PillProps {
  children: ReactNode;
  color?: string;
  solid?: boolean;
  dot?: boolean;
  title?: string;
  className?: string;
}

/** Base pill/badge used across cards and hero headers. */
export function Pill({
  children,
  color,
  solid = false,
  dot = false,
  title,
  className = '',
}: PillProps) {
  let style: CSSProperties | undefined;
  if (solid && color) style = { backgroundColor: color, color: '#fff' };
  else if (color) style = softStyle(color);

  return (
    <span
      title={title}
      style={style}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 ${
        !style ? 'bg-slate-100 text-slate-700' : ''
      } ${className}`}
    >
      {dot && color && (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      {children}
    </span>
  );
}
