import React from "react";
import {
    useTheme,
    Box,
    Typography,
    TextField,
    CircularProgress,
    Grid,
} from "@mui/material";

interface CharacterProps {
    name: string;
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

    const calculateTransition = (startColor: { r: number, g: number, b: number }, endColor: { r: number, g: number, b: number }, percentage: number) => {
        const r = Math.round(startColor.r + (endColor.r - startColor.r) * (percentage / 100));
        const g = Math.round(startColor.g + (endColor.g - startColor.g) * (percentage / 100));
        const b = Math.round(startColor.b + (endColor.b - startColor.b) * (percentage / 100));
        return `rgb(${r}, ${g}, ${b})`;
    };

    const percentage = value * 100;

    if (percentage <= 50) {
        return calculateTransition(color1Rgb, color2Rgb, percentage * 2);
    } else {
        return calculateTransition(color2Rgb, color3Rgb, (percentage - 50) * 2);
    }
};


const createDamageStyles = (damagePercentage: number) => {
    return {
        "& .MuiInputBase-root": {
            color: getDamageColor(damagePercentage),
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: getDamageColor(damagePercentage),
        },
        "& .MuiInputBase-root.Mui-disabled": {
            "& > fieldset": {
                borderColor: "#121212",
            },
        },
        "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: getDamageColor(damagePercentage),
        },
        "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
                borderColor: getDamageColor(damagePercentage),
            },
        },
        "& .Mui-focused": {
            "&:hover fieldset": {
                borderColor: getDamageColor(damagePercentage),
            },
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: getDamageColor(damagePercentage),
            },
        },
    };
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

    return (
        <>
            <Typography>{label}:</Typography>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <TextField
                    type="number"
                    value={currentDamage}
                    onChange={handleDamageChange}
                    size="small"
                    sx={createDamageStyles(currentDamage / damage.max)}
                />
                <CircularProgress
                    variant="determinate"
                    value={(currentDamage / damage.max) * 100}
                    size={60}
                    thickness={4}
                    sx={{
                        color: getDamageColor(currentDamage / damage.max),
                    }}
                />
                <Typography
                    sx={{
                        color: getDamageColor(currentDamage / damage.max),
                    }}
                >{`${currentDamage}/${damage.max}`}</Typography>
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
        <Box sx={{ p: 2, border: "1px solid", borderColor: theme.palette.primary.dark, borderRadius: "4px" }}>
            <Typography variant="h5">{name}</Typography>
            <Typography variant="body1">Race: {race}</Typography>
            <Typography variant="body1">Role: {role}</Typography>
            <Typography variant="body1">Description: {description}</Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Box sx={{ my: 2 }}>
                        <Box sx={{ textAlign: "right" }}>
                            <Typography variant="body2">Armor: {armor}</Typography>
                            <Typography variant="body2">Weapon: {weapon}</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box
                        sx={{
                            my: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start", // Align items to the right
                        }}
                    >
                        <Box
                            sx={{
                                textAlign: "right",
                            }}
                        >
                            <Typography variant="body2">Cyberware:</Typography>
                            {cyberware.map((item) => (
                                <Typography variant="body2">{item}</Typography>
                            ))}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Box sx={{ my: 2 }}>
                        <Box sx={{ textAlign: "right" }}>
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
                    <Box
                        sx={{
                            my: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start", // Align items to the right
                        }}
                    >
                        <Box
                            sx={{
                                textAlign: "right",
                            }}
                        >
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
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item>
                    <DamageComponent
                        label="Physical Damage"
                        damage={damage.physical}
                    />
                </Grid>
                <Grid item>
                    <DamageComponent label="Stun Damage" damage={damage.stun} />
                </Grid>

            </Grid>
        </Box>
    );
};

