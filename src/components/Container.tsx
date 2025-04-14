import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container = ({ children, className = "" }: ContainerProps) => {
  return (
    <div className={`max-w-md mx-auto px-4 py-6 ${className}`}>{children}</div>
  );
};
