import { styled } from "@stitches/react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { CardFront } from "./CardFront";
import { CardHidden } from "./CardHidden";

const CardFieldLayout = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "33vh",
});

const CardContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  margin: "5px",
});

const CardHandLayoutWrapper = styled("div", {
  width: "100%",
});

export const CardField: React.FC<{ isPlayer?: boolean; cards: any[] }> = ({
  isPlayer,
  cards,
}) => {
  if (isPlayer) {
    return (
      <Droppable droppableId="playerField" direction="horizontal">
        {(provided) => (
          <CardFieldLayout ref={provided.innerRef}>
            {cards.map((card, index) => (
              <Draggable draggableId={card.key} index={index} key={card.key}>
                {(provided) => (
                  <CardContainer
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <CardFront
                      name={card.name}
                      text={card.text}
                      attack={card.attack}
                      defense={card.defense}
                      mana={card.mana}
                      type={card.type}
                      effects={card.effect}
                      image={card.img}
                      key={card.key}
                    ></CardFront>
                  </CardContainer>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </CardFieldLayout>
        )}
      </Droppable>
    );
  } else {
    return (
      // <CardFieldLayout>
      //   {cards.map((card, index) => {
      //     return (
      //       <CardFront
      //         name={card.name}
      //         text={card.text}
      //         attack={card.attack}
      //         defense={card.defense}
      //         mana={card.mana}
      //         type={card.type}
      //         effects={card.effect}
      //         image={card.img}
      //         key={card.key}
      //       ></CardFront>
      //     );
      //   })}
      // </CardFieldLayout>
      <Droppable
        droppableId="enemyField"
        direction="horizontal"
        isDropDisabled={true}
      >
        {(provided) => (
          <CardFieldLayout ref={provided.innerRef}>
            {cards.map((card, index) => (
              <CardContainer key={card.key} ref={provided.innerRef}>
                <CardFront
                  name={card.name}
                  text={card.text}
                  attack={card.attack}
                  defense={card.defense}
                  mana={card.mana}
                  type={card.type}
                  effects={card.effect}
                  image={card.img}
                  key={card.key}
                ></CardFront>
              </CardContainer>
            ))}
          </CardFieldLayout>
        )}
      </Droppable>
    );
  }
};
