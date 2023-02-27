import { styled } from "@stitches/react";
import { GameState, PlayerAttackable } from "../utils/Enum";
import { Card, CardCoordinates, CardStance } from "../utils/Types";
import { CardHand } from "./atoms/CardHand";
import { GameFieldBackground } from "./atoms/GameFieldBackground";
import { GameField } from "./molecules/GameField";

const GameAreaLayout = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: 6,
  height: "100%",
});

export const GameArea: React.FC<{
  getCoordiantes: (e: HTMLElement) => void;
  playerCards: Card[];
  playerFieldCards: Card[];
  enemyFieldCards: Card[];
  enemyCards: number[];
  gameState: GameState;
  setSelectedCard: (card: any) => void;
  fightCard: (card: Card, e: any) => void;
  enemySelectedCard: number[];
  setEnemySelectedCard?: (card: number[]) => void;
  setSelectedCardCoordinates: (e: any) => void;
  selectedCard?: Card;
  addCardPositions: (card: any, player: boolean) => void;
  attackedCard: CardCoordinates;
  enemyAttackingCard: Card;
  enemyAttackingFinished: (card: any) => void;
  alreadyAttackedCards?: any[];
  changeCardStance: (card: CardStance) => void;
  attackingEnemyFinished: () => void;
  cardDied: (attackingCard: boolean) => void;
  showPlayerIcon: PlayerAttackable;
  showEnemyIcon: PlayerAttackable;
  attackPlayer: (e: any) => void;
  playerCardToDie: Card;
  enemyCardToDie: Card;
  changeIntialCardStance: (card: CardStance) => void;
  showCard: (card: Card) => void;
  getPlayerIconCoordiantes: (e: HTMLElement) => void;
  playerIconPos: number[];
}> = ({
  getCoordiantes,
  playerCards,
  playerFieldCards,
  enemyFieldCards,
  enemyCards,
  gameState,
  setSelectedCard,
  fightCard,
  enemySelectedCard,
  setEnemySelectedCard,
  setSelectedCardCoordinates,
  selectedCard,
  addCardPositions,
  attackedCard,
  enemyAttackingCard,
  enemyAttackingFinished,
  alreadyAttackedCards,
  changeCardStance,
  attackingEnemyFinished,
  showPlayerIcon,
  showEnemyIcon,
  attackPlayer,
  enemyCardToDie,
  playerCardToDie,
  cardDied,
  changeIntialCardStance,
  showCard,
  getPlayerIconCoordiantes,
  playerIconPos,
}) => {
  return (
    <GameAreaLayout>
      <GameFieldBackground></GameFieldBackground>
      <CardHand
        gameState={gameState}
        isEnemy={true}
        getCoordiantes={() => {}}
        cards={enemyCards}
        changeCardStance={changeIntialCardStance}
        showIcon={showEnemyIcon}
        attackPlayer={attackPlayer}
        showCard={showCard}
        getPlayerIconCoordiantes={getPlayerIconCoordiantes}
      ></CardHand>

      <GameField
        playerCards={playerFieldCards}
        enemyCards={enemyFieldCards}
        gameState={gameState}
        setSelectedCard={setSelectedCard}
        fightCard={fightCard}
        enemySelectedCard={enemySelectedCard}
        setEnemySelectedCard={setEnemySelectedCard}
        setSelectedCardCoordinates={setSelectedCardCoordinates}
        selectedCard={selectedCard}
        addCardPositions={addCardPositions}
        attackedCard={attackedCard}
        enemyAttackingCard={enemyAttackingCard}
        enemyAttackingFinished={enemyAttackingFinished}
        alreadyAttackedCards={alreadyAttackedCards}
        changeCardStance={changeCardStance}
        attackingEnemyFinished={attackingEnemyFinished}
        enemyCardToDie={enemyCardToDie}
        playerCardToDie={playerCardToDie}
        cardDied={cardDied}
        showCard={showCard}
        playerIconPos={playerIconPos}
      ></GameField>
      <CardHand
        gameState={gameState}
        isEnemy={false}
        getCoordiantes={getCoordiantes}
        cards={playerCards}
        changeCardStance={changeIntialCardStance}
        showIcon={showPlayerIcon}
        attackPlayer={attackPlayer}
        showCard={showCard}
        getPlayerIconCoordiantes={getPlayerIconCoordiantes}
      ></CardHand>
    </GameAreaLayout>
  );
};
