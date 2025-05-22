import React, {
    ComponentProps,
  } from "react";
  import { TextField } from "@mui/material";
    
  import { Colors, TextfieldStyle } from "../styles/styles.tsx";

/**
 * Props for the StyledTextField component.
 * Extends MUI TextField props and adds custom props like `innerRef` and `color`.
 */
type StyledTextFieldProps = ComponentProps<typeof TextField> & {
    /** A ref that is forwarded to the underlying MUI TextField's root div element. */
    innerRef: React.Ref<HTMLDivElement>;
    /** The color theme for the text field. See {@link Colors}. */
    color: Colors;
  };
  
/**
 * StyledTextField is a wrapper component around MUI's TextField.
 * It applies custom styling defined by `TextfieldStyle` based on the provided `color` prop.
 * It also forwards the `innerRef` to the underlying TextField component.
 *
 * @param props - The props for the component. See {@link StyledTextFieldProps}.
 * @returns The StyledTextField component.
 */
  export default function StyledTextField ({
    innerRef,
    color,
    ...props
  }: StyledTextFieldProps) {
    return <TextField {...props} color={color} ref={innerRef} sx={TextfieldStyle({ color })} />;
  };