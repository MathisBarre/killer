import { Button } from "./Button";
import { Container } from "./Container";
import { motion } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface LandingScreenProps {
  onStartGame: () => void;
}

export const LandingScreen = ({ onStartGame }: LandingScreenProps) => {
  return (
    <div className="flex flex-col">
      <div className="h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-blue-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-4 mb-20"
        >
          <motion.h1
            className="text-5xl text-balance font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Killer party !
          </motion.h1>

          <motion.p
            className="text-xl mb-12 text-gray-700 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Bienvenue dans le jeu du Killer, un jeu de défi et de stratégie
            entre amis !
          </motion.p>

          <motion.div
            className="flex flex-col items-center space-y-2 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-gray-600 flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Fonctionne hors-ligne
            </p>
            <p className="text-gray-600 flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Un seul téléphone
            </p>
            <p className="text-gray-600 flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Sauvegarde automatique
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              onClick={onStartGame}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 text-xl"
            >
              Commencer une partie
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-0 flex flex-col items-center cursor-pointer"
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
        >
          <p className="text-gray-600 mb-2">Règles</p>
          <ChevronDownIcon className="h-6 w-6 text-gray-600 animate-bounce" />
        </motion.div>
      </div>

      <Container className="">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-left"
        >
          <h2 className="font-bold text-2xl mb-6 text-gray-800">
            Règles du jeu :
          </h2>
          <ul className="space-y-4 text-gray-700 text-lg">
            <motion.li
              className="flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <span className="text-blue-500 mr-2">•</span>
              Chaque joueur reçoit une cible secrète (un autre joueur) et une
              mission unique à accomplir.
            </motion.li>
            <motion.li
              className="flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <span className="text-blue-500 mr-2">•</span>
              Éliminez votre cible en accomplissant votre mission sur elle.
            </motion.li>
            <motion.li
              className="flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <span className="text-blue-500 mr-2">•</span>
              Une fois votre cible éliminée, vous récupérez sa cible et sa
              mission.
            </motion.li>
            <motion.li
              className="flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
            >
              <span className="text-blue-500 mr-2">•</span>
              Ne révélez jamais votre cible ou mission aux autres joueurs.
            </motion.li>
            <motion.li
              className="flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              <span className="text-blue-500 mr-2">•</span>
              Si vous réalisez que quelqu'un tente de vous éliminer, vous pouvez
              faire un contre-assassinat en accomplissant votre mission sur
              l'attaquant (possible seulement une fois toutes les 20 minutes).
            </motion.li>
            <motion.li
              className="flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              <span className="text-blue-500 mr-2">•</span>
              Le dernier survivant remporte la partie !
            </motion.li>
          </ul>
        </motion.div>
      </Container>
    </div>
  );
};
