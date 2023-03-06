import { styled } from "@stitches/react";
import Image from "next/image";
import { relative } from "node:path/win32";
import { SizeVariants } from "../../utils/Enum";
import { Card, CardStance } from "../../utils/Types";

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

  variants: {
    size: {
      [SizeVariants.SMALL]: {
        fontSize: "30%",
      },
      [SizeVariants.MEDIUM]: {
        fontSize: "60%",
      },
      [SizeVariants.LARGE]: {
        fontSize: "90%",
      },
    },
  },
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

  variants: {
    size: {
      [SizeVariants.SMALL]: {
        fontSize: "30%",
      },
      [SizeVariants.MEDIUM]: {
        fontSize: "60%",
      },
      [SizeVariants.LARGE]: {
        fontSize: "90%",
      },
    },
  },
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

  variants: {
    size: {
      [SizeVariants.SMALL]: {
        fontSize: "30%",
      },
      [SizeVariants.MEDIUM]: {
        fontSize: "60%",
      },
      [SizeVariants.LARGE]: {
        fontSize: "90%",
      },
    },
  },
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

  variants: {
    size: {
      [SizeVariants.SMALL]: {
        fontSize: "30%",
      },
      [SizeVariants.MEDIUM]: {
        fontSize: "60%",
      },
      [SizeVariants.LARGE]: {
        fontSize: "90%",
      },
    },
  },
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

  variants: {
    size: {
      [SizeVariants.SMALL]: {
        fontSize: "30%",
      },
      [SizeVariants.MEDIUM]: {
        fontSize: "60%",
      },
      [SizeVariants.LARGE]: {
        fontSize: "90%",
      },
    },
  },
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

  variants: {
    size: {
      [SizeVariants.SMALL]: {
        fontSize: "30%",
      },
      [SizeVariants.MEDIUM]: {
        fontSize: "60%",
      },
      [SizeVariants.LARGE]: {
        fontSize: "90%",
      },
    },
  },
});

const CardText = styled("p", {
  position: "absolute",
  top: "70%",
  left: "18%",
  width: "64%",
  textAlign: "left",
  fontFamily: "Immortal",
  fontSize: "60%",

  variants: {
    size: {
      [SizeVariants.SMALL]: {
        fontSize: "30%",
      },
      [SizeVariants.MEDIUM]: {
        fontSize: "60%",
      },
      [SizeVariants.LARGE]: {
        fontSize: "90%",
      },
    },
  },
});

export const CardFront: React.FC<{
  card: Card;
  sizeVariant?: SizeVariants;
  cardStance?: "attack" | "defense";
  trapped: boolean;
  showCard: (card: Card) => void;
}> = ({ card, sizeVariant, cardStance, showCard, trapped }) => {
  if (!sizeVariant) {
    sizeVariant = SizeVariants.MEDIUM;
  }

  let stanceIcon = "schwert.png";
  if (cardStance && cardStance == "defense") {
    stanceIcon = "schild.png";
    if (trapped) {
      stanceIcon = "schild-trapped.png";
    }
  }
  if (sizeVariant == SizeVariants.SMALL || !cardStance) {
    stanceIcon = "";
  }

  const CardImage = styled("div", {
    position: "relative",
    top: 5,
    right: 0,
    width: "100%",
    height: "60%",
    backgroundImage: "url('" + "/img/" + card.img + "')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    borderRadius: "10px 10px 0 0",
  });

  const CardIcon = styled("div", {
    position: "absolute",
    top: "-5%",
    left: "-8%",
    width: "20%",
    aspectRatio: 1 / 1,
    backgroundImage: "url('" + "/img/icons/" + stanceIcon + "')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    // borderStyle: "solid"
  });

  let templateURL = "/img/card-template.png";
  switch (card.religion_type.split("/")[0]) {
    case "Knight":
      templateURL = "/img/card-template-knight.png";
      break;
    case "Romulus":
      templateURL = "/img/card-template-romulus.png";
      break;
    case "Steampunk":
      templateURL = "/img/card-template-steampunk.png";
      break;
    case "Vikings":
      templateURL = "/img/card-template-vikings.png";
      break;
    case "Earthling":
      templateURL = "/img/card-template-earthlings.png";
      break;
    case "Titan":
      templateURL = "/img/card-template-titans.png";
      break;
    default:
        templateURL = "/img/card-template.png";
  }

  return (
    <CardContainer size={sizeVariant} onMouseOver={() => showCard(card)}>
      <CardImage></CardImage>
      <Image
        src={templateURL}
        alt={"template"}
        fill
        draggable={false}
      />
      <CardName size={sizeVariant}>{card.name}</CardName>
      <CardMana size={sizeVariant}>{card.mana}</CardMana>
      <CardAttackValue size={sizeVariant}>{card.attack}</CardAttackValue>
      <CardDefenseValue size={sizeVariant}>{card.defense}</CardDefenseValue>
      <CardType size={sizeVariant}>{card.religion_type}</CardType>
      <CardEffects size={sizeVariant}>{card.effect.join(", ")}</CardEffects>
      <CardText size={sizeVariant}>{card.text}</CardText>
      <CardIcon></CardIcon>
    </CardContainer>
  );
};
