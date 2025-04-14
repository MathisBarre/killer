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
        // Utilisation de la hauteur dynamique pour éviter les problèmes avec la barre d'adresse mobile
        height: "100dvh",
      }}
    >
      {children}
    </div>
  );
};
