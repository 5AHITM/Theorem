import { styled } from "@stitches/react";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const NameBox = styled("div", {
  height: "15rem",
  width: "10rem",
});

const NameList = styled("ul", {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "left",
});

export default function TestPage() {
  const list: string[] = [
    "Marvin",
    "Simon",
    "Felix",
    "Gregor",
    "Daniel",
    "Fabian",
    "Grinning Tree",
    "EderEderEder",
    "Jürgen",
  ];

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // alert(list)
    list.splice(source.index, 1);
    list.splice(destination.index, 0, draggableId);
    // alert(list)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="1" direction="horizontal">
        {(provided) => (
          <NameList ref={provided.innerRef} {...provided.droppableProps}>
            {list.map((name, index) => {
              return (
                <Draggable key={name} draggableId={name} index={index}>
                  {(provided) => (
                    <div>
                      <NameBox
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <p>{name}</p>
                      </NameBox>
                    </div>
                  )}
                </Draggable>
              );
            })}
          </NameList>
        )}
      </Droppable>
    </DragDropContext>
  );
}
