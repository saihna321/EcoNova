import { cn } from "../lib/cn";

const buttonVariants = {
  default: "border-transparent bg-emerald-500 text-zinc-950 hover:bg-emerald-400",
  secondary: "border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800",
  outline: "border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100",
  ghost: "border-transparent bg-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
  destructive: "border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/15",
};

const buttonSizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  icon: "h-9 w-9 p-0",
};

export function Button({ children, className, variant = "default", size = "md", ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant] ?? buttonVariants.default,
        buttonSizes[size] ?? buttonSizes.md,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn("rounded-lg border border-zinc-800 bg-zinc-950/70 shadow-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("space-y-1.5 border-b border-zinc-800 px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("text-base font-medium text-zinc-100", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn("text-xs text-zinc-500", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
}

export function Badge({ className, children, variant = "default", ...props }) {
  const variants = {
    default: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    secondary: "border-zinc-800 bg-zinc-900 text-zinc-400",
    warning: "border-amber-500/25 bg-amber-500/10 text-amber-300",
    destructive: "border-red-500/25 bg-red-500/10 text-red-300",
    info: "border-blue-500/25 bg-blue-500/10 text-blue-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        variants[variant] ?? variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function Input(props) {
  const { className, ...rest } = props;
  return (
    <input
      className={cn(
        "h-9 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none transition-colors focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10",
        className
      )}
      {...rest}
    />
  );
}

export function Select(props) {
  const { className, children, ...rest } = props;
  return (
    <select
      className={cn(
        "h-9 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none transition-colors focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10",
        className
      )}
      {...rest}
    >
      {children}
    </select>
  );
}
