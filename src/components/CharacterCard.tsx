import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Grid,
  Accordion,
  AccordionSummary,
} from "@mui/material";
import {
  ActionButtonsBoxStyle,
  ActionButtonStyle,
  AccordionGridStyle,
  CardBoxStyle,
  InfoBoxStyle,
  InfoInnerBoxStyle,
  CyberwareBoxStyle,
  SkillsBoxStyle,
  DamageGridStyle,
  DamageComponentBoxStyle,
  getDamageColor,
  CreateDamageInputFieldStyle,
} from "../styles/styles";
import { CharacterProps } from "../models/CharacterProps";

// =====================
// Types
// =====================

/**
 * Props for the CharacterManager component.
 */
interface CharacterManagerProps {
  /** Optional callback function to be executed when NPCs are created. */
  onCreateNPCs?: () => void;
  /** Optional callback function to be executed when characters are cleared. */
  onClear?: () => void;
}

// =====================
// Components
// =====================

/**
 * CharacterManager is a component that manages a list of characters.
 * It allows creating new NPCs and clearing the list of characters.
 * Characters are displayed in Accordians, with the CharacterCard component.
 *
 * @param props - The props for the component. See {@link CharacterManagerProps}.
 * @returns The CharacterManager component.
 */
export const CharacterManager: React.FC<CharacterManagerProps> = ({
  onCreateNPCs,
  onClear,
}) => {
  /** State variable for storing the list of characters. */
  const [characters, setCharacters] = useState<Array<CharacterProps>>([]);

  /**
   * Handles the creation of new NPCs.
   * Adds a new character to the list and calls the onCreateNPCs callback.
   */
  const handleCreateNPCs = useCallback(() => {
    setCharacters((prevCharacters) => [
      ...prevCharacters,
      {
        name: "New Character",
        id: prevCharacters.length + 1,
        race: "Human",
        role: "Warrior",
        description: "This is a new character",
        attributes: {
          Agility: 2,
          Strength: 2,
          Body: 3,
          Intuition: 4,
          Willpower: 5,
        },
        skills: { Weapon: 6, Gymnastics: 7 },
        armor: 8,
        weapon: "Sword",
        cyberware: ["banana", "apple"],
        damage: {
          physical: { current: 9, max: 10 },
          stun: { current: 11, max: 12 },
        },
      },
    ]);
    onCreateNPCs?.();
  }, [onCreateNPCs]);

  /**
   * Handles clearing the list of characters.
   * Clears the characters array and calls the onClear callback.
   */
  const handleClear = useCallback(() => {
    setCharacters([]);
    onClear?.();
  }, [onClear]);

  return (
    <Grid container spacing={2}>
      <Grid>
        <Box sx={ActionButtonsBoxStyle()}>
          <Button
            color="primary"
            sx={ActionButtonStyle()}
            onClick={handleCreateNPCs}
          >
            Create NPCs
          </Button>
          <Button
            color="primary"
            sx={ActionButtonStyle()}
            onClick={handleClear}
          >
            Clear
          </Button>
        </Box>
      </Grid>
      <Grid sx={AccordionGridStyle()}>
        {characters.map((character) => (
          <Accordion key={character.id}>
            <AccordionSummary
              aria-controls={`panel${character.id}-content`}
              id={`panel${character.id}-header`}
            >
              <Typography>{character.name}</Typography>
            </AccordionSummary>
            <CharacterCard {...character} />
          </Accordion>
        ))}
      </Grid>
    </Grid>
  );
};

/**
 * Props for the DamageComponent.
 */
interface DamageComponentProps {
  /** The label for the damage type (e.g., "Physical Damage"). */
  label: string;
  /** An object containing the current and maximum damage values. */
  damage: {
    current: number;
    max: number;
  };
}

/**
 * DamageComponent displays and manages a specific type of damage (e.g., physical or stun).
 * It includes a text field for changing the current damage and a circular progress bar
 * to visually represent the damage level.
 *
 * @param props - The props for the component. See {@link DamageComponentProps}.
 * @returns The DamageComponent.
 */
const DamageComponent: React.FC<DamageComponentProps> = ({
  label,
  damage,
}) => {
  /** State variable for the current damage value. */
  const [currentDamage, setCurrentDamage] = React.useState(damage.current);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // we implement the wheel effect ourselfes to be able to avoid
  // propagating wheel event -> container scoll
  React.useEffect(() => {
    const inputEl = inputRef.current;

    /**
     * Handles the wheel event on the damage input field.
     * This is implemented to prevent the container from scrolling when the wheel is used over the input.
     * @param e - The wheel event.
     */
    const handleWheel = (e: WheelEvent) => {
      if (document.activeElement === inputEl) {
        // avoid propagting wheel event -> container scoll
        e.stopPropagation();
      }
    };

    inputEl?.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      inputEl?.removeEventListener("wheel", handleWheel);
    };
  }, []);

  /**
   * Handles the change event of the damage input field.
   * Updates the current damage value if it's within the valid range (0 to max).
   * @param event - The input change event.
   */
  const handleDamageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(event.target.value);
    if (inputValue >= 0 && inputValue <= damage.max) {
      setCurrentDamage(inputValue);
    }
  };

  const percentage = currentDamage / damage.max;

  return (
    <>
      <Typography>{label}:</Typography>
      <Box sx={DamageComponentBoxStyle()}>
        <TextField
          type="number"
          value={currentDamage}
          onChange={handleDamageChange}
          size="small"
          inputRef={inputRef}
          sx={CreateDamageInputFieldStyle(percentage)}
        />
        <CircularProgress
          variant="determinate"
          value={percentage * 100}
          size={60}
          thickness={4}
          sx={{
            color: getDamageColor(percentage),
            padding: "5px 5px 5px 5px",
          }}
        />
        <Typography sx={{ color: getDamageColor(percentage) }}>
          {`${currentDamage}/${damage.max}`}
        </Typography>
      </Box>
    </>
  );
};

/**
 * CharacterCard is a component that displays the details of a single character.
 * It shows information like name, race, role, attributes, skills, armor, weapon, cyberware, and damage.
 *
 * @param props - The props for the component, which are defined by {@link CharacterProps}.
 * @returns The CharacterCard component.
 */
export const CharacterCard: React.FC<CharacterProps> = ({
  name,
  race,
  role,
  description,
  attributes,
  skills,
  armor,
  weapon,
  cyberware,
  damage,
}) => {
  return (
    <Box sx={CardBoxStyle()}>
      <Typography variant="h5">{name}</Typography>
      <Typography variant="body1">Race: {race}</Typography>
      <Typography variant="body1">Role: {role}</Typography>
      <Typography variant="body1">Description: {description}</Typography>
      <Grid container spacing={2} justifyContent={"center"}>
        <Grid>
          <Box sx={InfoBoxStyle()}>
            <Box sx={InfoInnerBoxStyle()}>
              <Typography variant="body2">Armor: {armor}</Typography>
              <Typography variant="body2">Weapon: {weapon}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid>
          <Box sx={CyberwareBoxStyle()}>
            <Box sx={InfoInnerBoxStyle()}>
              <Typography variant="body2">Cyberware:</Typography>
              {cyberware.map((item, index) => (
                <Typography key={index} variant="body2">
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent={"center"}>
        <Grid>
          <Box sx={InfoBoxStyle()}>
            <Box sx={InfoInnerBoxStyle()}>
              <Typography variant="body2">Attributes:</Typography>
              {Object.entries(attributes).map(([key, value]) => (
                <Typography key={key} variant="body2">
                  {key}: {value}
                </Typography>
              ))}
            </Box>
          </Box>
        </Grid>
        <Grid>
          <Box sx={SkillsBoxStyle()}>
            <Box sx={InfoInnerBoxStyle()}>
              <Typography variant="body2">Skills:</Typography>
              {Object.entries(skills).map(([key, value]) => (
                <Typography key={key} variant="body2">
                  {key}: {value}
                </Typography>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={DamageGridStyle()}>
        <Grid>
          <DamageComponent label="Physical Damage" damage={damage.physical} />
        </Grid>
        <Grid>
          <DamageComponent label="Stun Damage" damage={damage.stun} />
        </Grid>
      </Grid>
    </Box>
  );
};
