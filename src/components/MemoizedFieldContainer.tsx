import React from "react";
import FieldContainer, { FieldContainerType } from "./FieldContainer";
import { Colors } from "../styles/styles";

// Props interface for the memoized field container
interface MemoizedFieldContainerProps {
  sendCallback?: () => Promise<void>;
  changeCallback?: (arg: string) => void;
  stopCallback?: () => Promise<void>;
  value: string;
  instance: string;
  color: Colors;
  type: FieldContainerType;
  disabled?: boolean;
  placeholder?: string;
  speechToTextCallback?: (audioBlob: Blob) => Promise<void>;
}

// Custom comparison function for React.memo
const arePropsEqual = (
  prevProps: MemoizedFieldContainerProps,
  nextProps: MemoizedFieldContainerProps
): boolean => {
  // Only re-render if essential props change
  // Note: We don't compare callbacks as they should be stable from useCallback
  return (
    prevProps.value === nextProps.value &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.type === nextProps.type &&
    prevProps.instance === nextProps.instance &&
    prevProps.color === nextProps.color &&
    prevProps.placeholder === nextProps.placeholder
  );
};

// Memoized FieldContainer component
const MemoizedFieldContainer = React.memo<MemoizedFieldContainerProps>(
  ({
    sendCallback,
    changeCallback,
    stopCallback,
    value,
    instance,
    color,
    type,
    disabled = false,
    placeholder = "",
    speechToTextCallback,
  }) => {
    return (
      <FieldContainer
        sendCallback={sendCallback}
        changeCallback={changeCallback}
        stopCallback={stopCallback}
        value={value}
        instance={instance}
        color={color}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        speechToTextCallback={speechToTextCallback}
      />
    );
  },
  arePropsEqual
);

MemoizedFieldContainer.displayName = "MemoizedFieldContainer";

export default MemoizedFieldContainer;
