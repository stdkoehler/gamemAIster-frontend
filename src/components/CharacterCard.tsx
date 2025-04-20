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

// =====================
// Types
// =====================

export interface CharacterProps {
  name: string;
  id: number;
  race: string;
  role: string;
  description: string;
  attributes: {
    [key: string]: number;
  };
  skills: {
    [key: string]: number;
  };
  armor: number;
  weapon: string;
  cyberware: string[];
  damage: {
    physical: {
      current: number;
      max: number;
    };
    stun: {
      current: number;
      max: number;
    };
  };
}

interface CharacterManagerProps {
  onCreateNPCs?: () => void;
  onClear?: () => void;
}

// =====================
// Components
// =====================

export const CharacterManager: React.FC<CharacterManagerProps> = ({
  onCreateNPCs,
  onClear,
}) => {
  const [characters, setCharacters] = useState<Array<CharacterProps>>([]);

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
          Agility: 1,
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

  const handleClear = useCallback(() => {
    setCharacters([]);
    onClear?.();
  }, [onClear]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
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
      <Grid item xs={12} sx={AccordionGridStyle()}>
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

const DamageComponent: React.FC<{
  label: string;
  damage: {
    current: number;
    max: number;
  };
}> = ({ label, damage }) => {
  const [currentDamage, setCurrentDamage] = React.useState(damage.current);

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
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box sx={InfoBoxStyle()}>
            <Box sx={InfoInnerBoxStyle()}>
              <Typography variant="body2">Armor: {armor}</Typography>
              <Typography variant="body2">Weapon: {weapon}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
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
      <Grid container spacing={2}>
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
        <Grid item>
          <DamageComponent label="Physical Damage" damage={damage.physical} />
        </Grid>
        <Grid item>
          <DamageComponent label="Stun Damage" damage={damage.stun} />
        </Grid>
      </Grid>
    </Box>
  );
};
