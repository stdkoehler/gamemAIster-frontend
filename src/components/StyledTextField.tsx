import React, {
    ComponentProps,
  } from "react";
  import { TextField } from "@mui/material";
    
  import { Colors, TextfieldStyle } from "../styles/styles.tsx";

type StyledTextFieldProps = ComponentProps<typeof TextField> & {
    innerRef: React.Ref<HTMLDivElement>;
    color: Colors;
  };
  
  export default function StyledTextField ({
    innerRef,
    color,
    ...props
  }: StyledTextFieldProps) {
    return <TextField {...props} color={color} ref={innerRef} sx={TextfieldStyle({ color })} />;
  };