import { cn } from "../lib/utils";

// Subtle pulse animation for skeleton loading effect
export const Shimmer = () => <div className="absolute inset-0 animate-pulse" />;

export const SkeletonBase = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white/10 rounded-xl animate-pulse",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const SkeletonCircle = ({ className, ...props }) => (
  <SkeletonBase className={cn("rounded-full", className)} {...props} />
);

export const SkeletonText = ({ className, ...props }) => (
  <SkeletonBase className={cn("h-4 w-full", className)} {...props} />
);

export const SkeletonButton = ({ className, ...props }) => (
  <SkeletonBase className={cn("h-10 w-24 rounded-lg", className)} {...props} />
);

// New: Avatar skeleton with size variants
export const SkeletonAvatar = ({ size = "md", className, ...props }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };
  return <SkeletonCircle className={cn(sizes[size], className)} {...props} />;
};

// New: Card skeleton for content sections
export const SkeletonCard = ({ className, children, ...props }) => (
  <SkeletonBase
    className={cn("p-4 rounded-2xl bg-white/5", className)}
    {...props}
  >
    {children}
  </SkeletonBase>
);

// New: Code editor skeleton with line numbers
export const SkeletonCode = ({ lines = 12, className, ...props }) => {
  // Deterministic widths for code lines (no Math.random)
  const lineWidths = [85, 60, 45, 70, 90, 55, 75, 40, 80, 65, 50, 95];

  return (
    <div
      className={cn("bg-[#1e1e1e] rounded-xl overflow-hidden", className)}
      {...props}
    >
      <div className="flex">
        {/* Line numbers gutter */}
        <div className="w-12 bg-white/5 border-r border-white/5 py-4 px-2 flex flex-col gap-2">
          {[...Array(lines)].map((_, i) => (
            <div key={i} className="h-3 w-6 bg-white/5 rounded" />
          ))}
        </div>
        {/* Code content */}
        <div className="flex-1 p-4 space-y-2 relative overflow-hidden">
          <Shimmer />
          {[...Array(lines)].map((_, i) => (
            <div
              key={i}
              className="h-3 bg-white/5 rounded"
              style={{ width: `${lineWidths[i % lineWidths.length]}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// New: Tab bar skeleton
export const SkeletonTabs = ({ count = 3, className, ...props }) => (
  <div
    className={cn("flex border-b border-white/5 bg-black/20", className)}
    {...props}
  >
    {[...Array(count)].map((_, i) => (
      <SkeletonBase key={i} className="flex-1 h-10 m-1 rounded-lg" />
    ))}
  </div>
);

// New: Stats card skeleton
export const SkeletonStats = ({ className, ...props }) => (
  <SkeletonCard className={cn("flex flex-col gap-3", className)} {...props}>
    <div className="h-3 w-20 bg-white/10 rounded" />
    <div className="h-8 w-16 bg-white/10 rounded" />
    <div className="h-2 w-full bg-white/5 rounded-full" />
  </SkeletonCard>
);

export const SkeletonPage = ({ children, className }) => (
  <div
    className={cn(
      "h-screen w-full bg-[#050505] text-white overflow-hidden relative",
      className,
    )}
  >
    {/* Background Texture */}
    <div
      className="absolute inset-0 opacity-20 pointer-events-none"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
        backgroundSize: "40px 40px",
      }}
    />
    <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

    {children}

    <style>{`
      @keyframes shimmer {
        100% {
          transform: translateX(100%);
        }
      }
    `}</style>
  </div>
);
