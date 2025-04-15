import { ReactNode } from "react";

interface FullScreenContainerProps {
  children: ReactNode;
  className?: string;
}

export const FullScreenContainer = ({
  children,
  className = "",
}: FullScreenContainerProps) => {
  return (
    <div
      className={`fixed inset-0 flex flex-col ${className}`}
      style={{
        // Use min-height to ensure the container is at least the viewport height
        // but can grow larger if content requires it
        minHeight: "100dvh",
        height: "auto",
      }}
    >
      {children}
    </div>
  );
};
