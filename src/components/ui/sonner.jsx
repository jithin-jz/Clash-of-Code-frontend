import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="top-center"
      expand
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:rounded-xl group-[.toaster]:border group-[.toaster]:border-border/80 group-[.toaster]:bg-[linear-gradient(180deg,rgba(18,27,42,0.96)_0%,rgba(9,16,29,0.98)_100%)] group-[.toaster]:p-4 group-[.toaster]:text-foreground group-[.toaster]:shadow-[0_20px_45px_rgba(2,8,18,0.6)]",
          description:
            "group-[.toast]:text-xs group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:shadow-[0_8px_18px_hsl(var(--primary)/0.24)]",
          cancelButton:
            "group-[.toast]:bg-secondary/90 group-[.toast]:text-secondary-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
