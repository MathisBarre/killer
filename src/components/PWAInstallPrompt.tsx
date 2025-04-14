import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event so it can be triggered later
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    // Show the install prompt
    installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt");
      setIsInstalled(true);
    } else {
      console.log("User dismissed the install prompt");
    }

    // Clear the saved prompt as it can't be used again
    setInstallPrompt(null);
  };

  if (isInstalled || !installPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto w-max px-4 py-3 bg-indigo-600 text-white rounded-lg shadow-lg flex items-center space-x-3">
      <p className="text-sm">Installer l'application sur votre appareil</p>
      <button
        onClick={handleInstallClick}
        className="text-xs px-3 py-1.5 bg-white text-indigo-600 font-medium rounded-md"
      >
        Installer
      </button>
    </div>
  );
}
