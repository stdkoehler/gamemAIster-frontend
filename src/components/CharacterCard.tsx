import React, { useCallback, useState } from "react";
import {
  useTheme,
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Grid,
  Accordion,
  AccordionSummary,
} from "@mui/material";

// =====================
// Styles (centralized)
// =====================

const actionButtonsBoxSx = {
  display: "flex",
  justifyContent: "space-around",
  width: "100%",
};

const actionButtonSx = {
  width: "20%",
  textAlign: "center",
};

const accordionGridSx = (theme: any) => ({
  "& .MuiPaper-root": {
    backgroundImage: "none",
    boxShadow: `inset 0px 0px 0px 1px ${theme.palette.primary.dark}, 0px 0px 0px 0px #FF0000, 0px 0px 0px 0px #FF0000`,
    "&::before": {
      backgroundColor: "#121212",
    },
  },
});

const cardBoxSx = (theme: any) => ({
  p: 2,
  border: "0px solid",
  borderColor: theme.palette.primary.dark,
  borderRadius: "4px",
});

const infoBoxSx = { my: 2 };
const infoInnerBoxSx = { textAlign: "right" };

const cyberwareBoxSx = {
  my: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

const skillsBoxSx = cyberwareBoxSx;

const damageGridSx = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
};

const damageComponentBoxSx = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
};

// =====================
// Utility Functions
// =====================

const getDamageColor = (value: number) => {
  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  const color1Rgb = hexToRgb("#11ea7b");
  const color2Rgb = hexToRgb("#ffc400");
  const color3Rgb = hexToRgb("#e53f7e");

  const calculateTransition = (
    startColor: { r: number; g: number; b: number },
    endColor: { r: number; g: number; b: number },
    percentage: number
  ) => {
    const r = Math.round(
      startColor.r + (endColor.r - startColor.r) * (percentage / 100)
    );
    const g = Math.round(
      startColor.g + (endColor.g - startColor.g) * (percentage / 100)
    );
    const b = Math.round(
      startColor.b + (endColor.b - startColor.b) * (percentage / 100)
    );
    return `rgb(${r}, ${g}, ${b})`;
  };

  const percentage = value * 100;

  if (percentage <= 50) {
    return calculateTransition(color1Rgb, color2Rgb, percentage * 2);
  } else {
    return calculateTransition(color2Rgb, color3Rgb, (percentage - 50) * 2);
  }
};

const createDamageInputFieldStyles = (damagePercentage: number) => {
  const damageColor = getDamageColor(damagePercentage);
  return {
    padding: "5px 5px 5px 5px",
    width: "40%",
    "& .MuiInputBase-root": {
      color: damageColor,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: damageColor,
    },
    "& .MuiInputBase-root.Mui-disabled": {
      "& > fieldset": {
        borderColor: "#121212",
      },
    },
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: damageColor,
    },
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: damageColor,
      },
    },
    "& .Mui-focused": {
      "&:hover fieldset": {
        borderColor: damageColor,
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: damageColor,
      },
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      WebkitAppearance: "none",
      background:
        "#121212 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAcCAYAAADr9QYhAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAI6ADAAQAAAABAAAAHAAAAACbzWzwAAABB0lEQVRIDe2XMQ6DMAxFf6suwAjszLDCTeASHALEyFlg5hLsXIJDtPIQVFkkgrhDVCWLcQzJ84/liEeSJG84MIqiwMMVmCAI8HRAlAPBwxxSsIf/VKZpGozjiCiKWL7X3Z8oQyB1XSPLMnRdZw0khlEgKn8JkAiGg0iBrJse1UZZlmr/U7vvO7ZtO43xSWp61jB8ManvO7BJQVEBmxa2iXkYnWpOKfPSUV6Zb9sWaZpqX12WBeu6auM8IOozBNL3/SnQNE2Y55nvp/XFfYY67DAMIPs97oKob8U1w4FsQQhIdEwqI7J0ZFVVgerEZvi7yaSauGZMi9+NOQMThqEbP3FxHCPPc3wAmdpEetL9b2QAAAAASUVORK5CYII=) no-repeat center center",
      width: "2em",
      opacity: 1,
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden",
      borderTopRightRadius: "0.25rem",
      borderBottomRightRadius: "0.25rem",
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      background:
        "#121212 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAcCAYAAADr9QYhAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAI6ADAAQAAAABAAAAHAAAAACbzWzwAAABB0lEQVRIDe2XMQ6DMAxFf6suwAjszLDCTeASHALEyFlg5hLsXIJDtPIQVFkkgrhDVCWLcQzJ84/liEeSJG84MIqiwMMVmCAI8HRAlAPBwxxSsIf/VKZpGozjiCiKWL7X3Z8oQyB1XSPLMnRdZw0khlEgKn8JkAiGg0iBrJse1UZZlmr/U7vvO7ZtO43xSWp61jB8ManvO7BJQVEBmxa2iXkYnWpOKfPSUV6Zb9sWaZpqX12WBeu6auM8IOozBNL3/SnQNE2Y55nvp/XFfYY67DAMIPs97oKob8U1w4FsQQhIdEwqI7J0ZFVVgerEZvi7yaSauGZMi9+NOQMThqEbP3FxHCPPc3wAmdpEetL9b2QAAAAASUVORK5CYII=) no-repeat center center",
      width: "2em",
      opacity: 1,
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden",
      borderTopRightRadius: "0.25rem",
      borderBottomRightRadius: "0.25rem",
    },
  };
};

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
  const theme = useTheme();

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
        <Box sx={actionButtonsBoxSx}>
          <Button
            color="primary"
            sx={actionButtonSx}
            onClick={handleCreateNPCs}
          >
            Create NPCs
          </Button>
          <Button color="primary" sx={actionButtonSx} onClick={handleClear}>
            Clear
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} sx={accordionGridSx(theme)}>
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
      <Box sx={damageComponentBoxSx}>
        <TextField
          type="number"
          value={currentDamage}
          onChange={handleDamageChange}
          size="small"
          sx={createDamageInputFieldStyles(percentage)}
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
  const theme = useTheme();

  return (
    <Box sx={cardBoxSx(theme)}>
      <Typography variant="h5">{name}</Typography>
      <Typography variant="body1">Race: {race}</Typography>
      <Typography variant="body1">Role: {role}</Typography>
      <Typography variant="body1">Description: {description}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box sx={infoBoxSx}>
            <Box sx={infoInnerBoxSx}>
              <Typography variant="body2">Armor: {armor}</Typography>
              <Typography variant="body2">Weapon: {weapon}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={cyberwareBoxSx}>
            <Box sx={infoInnerBoxSx}>
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
          <Box sx={infoBoxSx}>
            <Box sx={infoInnerBoxSx}>
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
          <Box sx={skillsBoxSx}>
            <Box sx={infoInnerBoxSx}>
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
      <Grid container spacing={2} sx={damageGridSx}>
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
