import { Button } from "./Button";
import { Container } from "./Container";
import { motion } from "framer-motion";

interface LandingScreenProps {
  onStartGame: () => void;
}

export const LandingScreen = ({ onStartGame }: LandingScreenProps) => {
  return (
    <Container className="flex flex-col items-center justify-center min-h-[90vh] text-center bg-gradient-to-b from-blue-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-4"
      >
        <motion.h1
          className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Killer party !
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-10"
        >
          <p className="text-xl mb-6 text-gray-700">
            Bienvenue dans le jeu du Killer, un jeu de défi et de stratégie
            entre amis !
          </p>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg mb-8 text-left border border-gray-100"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="font-bold text-2xl mb-4 text-gray-800">
              Règles du jeu :
            </h2>
            <ul className="space-y-3 text-gray-700">
              <motion.li
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <span className="text-blue-500 mr-2">•</span>
                Chaque joueur reçoit une cible secrète (un autre joueur) et une
                mission unique à accomplir.
              </motion.li>
              <motion.li
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <span className="text-blue-500 mr-2">•</span>
                Éliminez votre cible en accomplissant votre mission sur elle.
              </motion.li>
              <motion.li
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <span className="text-blue-500 mr-2">•</span>
                Une fois votre cible éliminée, vous récupérez sa cible et sa
                mission.
              </motion.li>
              <motion.li
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <span className="text-blue-500 mr-2">•</span>
                Ne révélez jamais votre cible ou mission aux autres joueurs.
              </motion.li>
              <motion.li
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <span className="text-blue-500 mr-2">•</span>
                Si vous réalisez que quelqu'un tente de vous éliminer, vous
                pouvez faire un contre-assassinat en accomplissant votre mission
                sur l'attaquant (possible seulement une fois toutes les 20
                minutes).
              </motion.li>
              <motion.li
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <span className="text-blue-500 mr-2">•</span>
                Le dernier survivant remporte la partie !
              </motion.li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <Button
            onClick={onStartGame}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            Commencer une partie
          </Button>
        </motion.div>
      </motion.div>
    </Container>
  );
};
