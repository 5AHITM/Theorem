import { styled } from "@stitches/react";
import { GameState, PlayerAttackable } from "../utils/Enum";
import { Card, CardCoordinates, CardStance } from "../utils/Types";
import { CardHand } from "./atoms/CardHand";
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
  addCardPositions: (card: any) => void;
  attackedCard: CardCoordinates;
  enemyAttackingCard: Card;
  enemyAttackingFinished: (card: any) => void;
  alreadyAttackedCards?: any[];
  changeCardStance: (card: CardStance) => void;
  cardStances: CardStance[];
  attackingEnemyFinished: () => void;
  cardDied: (attackingCard: boolean) => void;
  showPlayerIcon: PlayerAttackable;
  showEnemyIcon: PlayerAttackable;
  attackPlayer: (e: any) => void;
  playerCardToDie: Card;
  enemyCardToDie: Card;
  changeIntialCardStance: (card: CardStance) => void;
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
  cardStances,
  attackingEnemyFinished,
  showPlayerIcon,
  showEnemyIcon,
  attackPlayer,
  enemyCardToDie,
  playerCardToDie,
  cardDied,
  changeIntialCardStance,
}) => {
  return (
    <GameAreaLayout>
      <CardHand
        gameState={gameState}
        isEnemy={true}
        getCoordiantes={() => {}}
        cards={enemyCards}
        changeCardStance={changeIntialCardStance}
        cardStances={cardStances}
        showIcon={showEnemyIcon}
        attackPlayer={attackPlayer}
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
        cardStances={cardStances}
        attackingEnemyFinished={attackingEnemyFinished}
        enemyCardToDie={enemyCardToDie}
        playerCardToDie={playerCardToDie}
        cardDied={cardDied}
      ></GameField>
      <CardHand
        gameState={gameState}
        isEnemy={false}
        getCoordiantes={getCoordiantes}
        cards={playerCards}
        changeCardStance={changeIntialCardStance}
        cardStances={cardStances}
        showIcon={showPlayerIcon}
        attackPlayer={attackPlayer}
      ></CardHand>
    </GameAreaLayout>
  );
};
