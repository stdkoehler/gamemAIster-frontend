import React, {
  ReactNode,
  ComponentProps,
  useState,
  useRef,
  useEffect,
} from "react";
import { TextField, Button, Typography, Box, useTheme } from "@mui/material";

import SplitScreen from "./SplitScreen.tsx";

import { Colors, TextfieldStyle } from "../styles/styles.tsx";

function StyledContainer({ children }: { children: ReactNode }) {
  return (
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
}

type StyledTextFieldProps = ComponentProps<typeof TextField> & {
  innerRef: React.Ref<HTMLDivElement>;
  color: Colors;
};

const StyledTextField = ({
  innerRef,
  color,
  ...props
}: StyledTextFieldProps) => {
  return <TextField {...props} color={color} ref={innerRef} sx={TextfieldStyle({ color })} />;
};

const ButtonContainer = ({ children }: { children: ReactNode }) => (
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

type FieldContainerProps = {
  sendCallback?: () => Promise<void>;
  changeCallback?: (arg: string) => void;
  value: string;
  name: string;
  initialEditable?: boolean;
  updateButton?: string;
  fixedRows?: number;
  colorType: Colors;
  disabled?: boolean;
};

export default function FieldContainer({
  sendCallback,
  changeCallback,
  value,
  name,
  colorType,
  initialEditable = false,
  updateButton = "Send",
  fixedRows = undefined,
  disabled = false,
}: FieldContainerProps) {
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

  const theme = useTheme();

  const textFieldRef = useRef<HTMLDivElement>(null);

  const toggleEditable = () => {
    setEditable(!editable);
  };

  const handleSend = async () => {
    console.log("test_inner");
    if (sendCallback && !locked) {
      setLocked(true);
      setEditable(false);
      await sendCallback();
    }
    setLocked(false);
    setEditable(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault(); // don't register the return key
      handleSend();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Call the callback function with the updated value
    if (changeCallback) {
      changeCallback(event.target.value);
    }
  };

  return (
    <StyledContainer>
      <SplitScreen leftWeight={1} rightWeight={11} color={colorType}>
        <Typography color={disabled ? theme.palette.grey.A700 : colorType}>{name}</Typography>
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
            disabled={disabled}
            sx={{ width: "20%", textAlign: "center" }}
          >
            Toggle Edit
          </Button>
        )}
        {sendCallback && (
          <Button
            onClick={handleSend}
            color={colorType}
            disabled={disabled}
            sx={{ width: "20%", textAlign: "center" }}
          >
            {updateButton}
          </Button>
        )}
      </ButtonContainer>
    </StyledContainer>
  );
}
