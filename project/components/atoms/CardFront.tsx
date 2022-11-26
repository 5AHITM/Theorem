import { styled } from "@stitches/react";
import Image from "next/image";
import { relative } from "node:path/win32";
import { SizeVariants } from "../../utils/Enum";
import { Card, CardStance } from "../../utils/Types";
import CardHiddenSVG from "./svg/CardHiddenSVG";

const CardContainer = styled("div", {
  display: "flex",
  width: "100%",
  position: "relative",
  aspectRatio: "1105/1556",

  variants: {
    size: {
      [SizeVariants.SMALL]: {},
      [SizeVariants.MEDIUM]: {},
      [SizeVariants.LARGE]: {},
    },
  },
});

const CardName = styled("p", {
  position: "absolute",
  top: "5.5%",
  left: "16%",
  width: "60%",
  textAlign: "left",
  fontFamily: "Immortal",
  display: "inline",
  fontSize: "60%",
});

const CardMana = styled("p", {
  position: "absolute",
  top: "5.5%",
  right: "20%",
  width: "20%",
  textAlign: "right",
  fontFamily: "Immortal",
  display: "inline",
  fontSize: "60%",
});

const CardAttackValue = styled("p", {
  position: "absolute",
  bottom: "4.5%",
  right: "16%",
  width: "5%",
  textAlign: "right",
  fontFamily: "Immortal",
  display: "inline",
  fontSize: "60%",
});

const CardDefenseValue = styled("p", {
  position: "absolute",
  bottom: "4.5%",
  right: "7.5%",
  width: "5%",
  textAlign: "left",
  fontFamily: "Immortal",
  display: "inline",
  fontSize: "60%",
});

const CardType = styled("p", {
  position: "absolute",
  bottom: "38.5%",
  left: "14%",
  width: "15%",
  textAlign: "left",
  fontFamily: "Immortal",
  display: "inline",
  fontSize: "60%",
});

const CardEffects = styled("p", {
  position: "absolute",
  bottom: "32%",
  left: "18%",
  width: "10%",
  textAlign: "left",
  fontFamily: "Immortal",
  display: "inline",
  fontSize: "60%",
});

const CardText = styled("p", {
  position: "absolute",
  top: "70%",
  left: "18%",
  width: "64%",
  textAlign: "left",
  fontFamily: "Immortal",
  fontSize: "60%",
});

export const CardFront: React.FC<{
  card: Card;
  sizeVariant?: SizeVariants;
  cardStance: CardStance;
}> = ({ card, sizeVariant }) => {
  if (!sizeVariant) {
    sizeVariant = SizeVariants.MEDIUM;
  }

  const CardImage = styled("div", {
    position: "relative",
    top: 0,
    right: 0,
    width: "100%",
    height: "60%",
    backgroundImage: "url('" + "/img/" + card.img + "')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  });

  return (
    <CardContainer size={sizeVariant}>
      <CardImage></CardImage>
      <Image
        src={"/img/card-template.png"}
        alt={"template"}
        fill
        draggable={false}
      />
      <CardName>{card.name}</CardName>
      <CardMana>{card.mana}</CardMana>
      <CardAttackValue>{card.attack}</CardAttackValue>
      <CardDefenseValue>{card.defense}</CardDefenseValue>
      <CardType>{card.religion_type}</CardType>
      <CardEffects>{card.effect.join(", ")}</CardEffects>
      <CardText>{card.text}</CardText>
    </CardContainer>
  );
};
