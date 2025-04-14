import { Button } from "./Button";
import { Container } from "./Container";

interface LandingScreenProps {
  onStartGame: () => void;
}

export const LandingScreen = ({ onStartGame }: LandingScreenProps) => {
  return (
    <Container className="flex flex-col items-center justify-center min-h-[90vh] text-center">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">Killer Game</h1>

      <div className="mb-10">
        <p className="text-lg mb-4">
          Bienvenue dans le jeu du Killer, un jeu de défi et de stratégie entre
          amis !
        </p>

        <div className="bg-gray-100 p-4 rounded-lg mb-6 text-left">
          <h2 className="font-bold mb-2 text-gray-800">Règles du jeu :</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>
              Chaque joueur reçoit une cible secrète (un autre joueur) et une
              mission unique à accomplir.
            </li>
            <li>
              Éliminez votre cible en accomplissant votre mission sur elle.
            </li>
            <li>
              Une fois votre cible éliminée, vous récupérez sa cible et sa
              mission.
            </li>
            <li>
              Ne révélez jamais votre cible ou mission aux autres joueurs.
            </li>
            <li>
              Si vous réalisez que quelqu'un tente de vous éliminer, vous pouvez
              faire un contre-assassinat en accomplissant votre mission sur
              l'attaquant (possible seulement une fois toutes les 20 minutes).
            </li>
            <li>Le dernier survivant remporte la partie !</li>
          </ul>
        </div>
      </div>

      <Button onClick={onStartGame} fullWidth>
        Commencer une partie
      </Button>
    </Container>
  );
};
