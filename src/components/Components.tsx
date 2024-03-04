import React, {
  ReactNode,
  ComponentProps,
  useState,
  useRef,
  useEffect,
} from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Divider,
  Box,
  alpha,
} from "@mui/material";
import { useTheme, Palette, PaletteColor } from "@mui/material";

type KeysByType<O, T> = {
  [K in keyof O]-?: T extends O[K] ? K : never;
}[keyof O];

type Colors = KeysByType<Palette, PaletteColor>;

type StyledDividerProps = ComponentProps<typeof Divider> & {
  color: Colors;
};

export const StyledDivider = ({ color, ...props }: StyledDividerProps) => {
  const theme = useTheme();
  const baseColor = theme.palette[color].main;

  return (
    <Divider
      {...props}
      sx={{
        backgroundColor: () => alpha(baseColor, 0.5),
        marginX: 2,
      }}
    />
  );
};

export const SplitScreen = ({
  children,
  leftWeight = 1,
  rightWeight = 1,
  color,
  scrollable = false
}: {
  children: ReactNode[];
  leftWeight: number;
  rightWeight: number;
  color: Colors;
  scrollable?: boolean;
}) => {
  const [left, right] = children;
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", flexDirection: "row", }}>
      <Box
        sx={{
          flex: leftWeight,
          maxHeight: "120vh",
          overflowY: scrollable ? "auto" : "visible",
          padding: "8px",
          '&::-webkit-scrollbar': {
            width: '0.4em'
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid',
            color: theme.palette[color].dark
          }
        }}
      >
        {left}
      </Box>
      <Box
        sx={{
          flex: rightWeight,
        }}
      >
        {right}
      </Box>
    </Box>
  );
};


type AdventureHeadingProps = ComponentProps<typeof Typography>;

export const AdventureHeading = (props: AdventureHeadingProps) => (
  <Typography {...props} sx={{ color: "#9c27b0", fontSize: "2rem" }} />
);

export const ImageContainer = ({ children }: { children: string }) => {
  return (
    <Box
      sx={{
        width: "100vw",
        display: "flex",
        flexDirection: "row",
        maskImage:
          "linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, transparent 100%)",
      }}
    >
      <img src={children} alt="" style={{ width: "100%", height: "auto" }} />
    </Box>
  );
};

type AppGridProps = ComponentProps<typeof Grid> & {
  children: ReactNode;
};

export const AppGrid = ({ children }: AppGridProps) => (
  <Grid
    container
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </Grid>
);

export const FieldContainer = ({ children }: { children: ReactNode }) => (
  <Box
    sx={{
      marginTop: "50px",
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      width: "90%",
      alignItems: "left",
    }}
  >
    {children}
  </Box>
);

type StyledTextFieldProps = ComponentProps<typeof TextField> & {
  innerRef: React.Ref<HTMLDivElement>;
  color: Colors;
};

export const StyledTextField = ({
  innerRef,
  color,
  ...props
}: StyledTextFieldProps) => {
  const theme = useTheme();
  const baseColor = theme.palette[color].main;
  const editColor = theme.palette[color].light;
  const darkColor = theme.palette[color].dark;

  const hoverColor = baseColor;
  const disabledColor = baseColor;

  return (
    <TextField
      {...props}
      ref={innerRef}
      sx={{
        display: "flex",
        width: "100%" /* Fields take up full width of their container */,
        paddingTop: 0,
        "& .MuiInputBase-root": {
          color: editColor,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: darkColor, // Set default border color based on colorType
        },
        "& .MuiInputBase-root.Mui-disabled": {
          "& > fieldset": {
            borderColor: "#121212", // Adjust color when disabled
          },
        },
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: disabledColor, // Adjust text color when disabled
        },
        // set color when inactive
        "& .MuiOutlinedInput-root": {
          "&:hover fieldset": {
            borderColor: hoverColor, // Adjust color on hover
          },
        },
        // set color when active
        "& .Mui-focused": {
          "&:hover fieldset": {
            borderColor: hoverColor, // Adjust color on hover
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: darkColor, // Set default border color based on colorType
          },
        }
      }}
    />
  );
};

export const ButtonContainer = ({ children }: { children: ReactNode }) => (
  <Box
    sx={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    }}
  >
    {children}
  </Box>
);

type FieldContainerComponentProps = {
  sendCallback?: () => Promise<void>;
  changeCallback?: (arg: string) => void;
  value: string;
  name: string;
  initialEditable?: boolean;
  updateButton?: string;
  fixedRows?: number;
  colorType: Colors;
};

export function FieldContainerComponent({
  sendCallback,
  changeCallback,
  value,
  name,
  colorType,
  initialEditable = false,
  updateButton = "Send",
  fixedRows = undefined,
}: FieldContainerComponentProps) {
  const [editable, setEditable] = useState(initialEditable);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    // Invoke your callback whenever the value changes
    if (textFieldRef.current != null) {
      const textarea = textFieldRef.current.querySelector("textarea");
      if (textarea != null) {
        textarea.scrollTop = textarea.scrollHeight;
      }
    }
  }, [value]);

  const textFieldRef = useRef<HTMLDivElement>(null);

  const toggleEditable = () => {
    setEditable(!editable);
  };

  const handleSend = async () => {
    console.log("test_inner");
    if (sendCallback && !locked) {
      setLocked(true)
      setEditable(false)
      await sendCallback();
    }
    setLocked(false)
    setEditable(true)
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault(); // don't register the return key    
      handleSend()
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Call the callback function with the updated value
    if (changeCallback) {
      changeCallback(event.target.value);
    }
  };

  return (
    <FieldContainer>
      <SplitScreen leftWeight={1} rightWeight={11} color={colorType}>
        <Typography color={colorType}>{name}</Typography>
        <StyledTextField
          innerRef={textFieldRef}
          type={name}
          name={name} // Assuming it's always the same name
          value={value}
          color={colorType}
          disabled={!editable}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          multiline
          rows={fixedRows}
          InputProps={{ readOnly: !editable }}
        />
      </SplitScreen>
      <ButtonContainer>
        {!initialEditable && changeCallback && (
          <Button
            onClick={toggleEditable}
            color={colorType}
            sx={{ width: "20%", textAlign: "center" }}
          >
            Toggle Edit
          </Button>
        )}
        {sendCallback && (
          <Button
            onClick={handleSend}
            color={colorType}
            sx={{ width: "20%", textAlign: "center" }}
          >
            {updateButton}
          </Button>
        )}
      </ButtonContainer>
    </FieldContainer>
  );
}
