import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="top-center"
      richColors
      closeButton
      visibleToasts={3}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#0a0f18] group-[.toaster]:text-foreground group-[.toaster]:border-white/[0.1] group-[.toaster]:shadow-premium group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:backdrop-blur-xl",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:text-xs group-[.toast]:font-medium",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-xl group-[.toast]:text-xs group-[.toast]:px-3",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-xl group-[.toast]:text-xs group-[.toast]:px-3",
          success: "group-[.toaster]:border-[#00af9b]/30 group-[.toaster]:bg-[#00af9b]/5",
          error: "group-[.toaster]:border-destructive/30 group-[.toaster]:bg-destructive/5",
          warning: "group-[.toaster]:border-accent/30 group-[.toaster]:bg-accent/5",
          info: "group-[.toaster]:border-blue-500/30 group-[.toaster]:bg-blue-500/5",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
