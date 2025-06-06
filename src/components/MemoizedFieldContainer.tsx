import React, { forwardRef } from "react";
import FieldContainer, {
  FieldContainerType,
  FieldContainerHandle,
} from "./FieldContainer";
import { Colors } from "../styles/styles";

// Props interface for the memoized field container
interface MemoizedFieldContainerProps {
  sendCallback?: (valueToSend: string) => Promise<void>;
  changeCallback?: (arg: string) => void;
  onCommit?: (value: string) => void;
  stopCallback?: () => Promise<void>;
  value: string;
  instance: string;
  color: Colors;
  type: FieldContainerType;
  disabled?: boolean;
  placeholder?: string;
  speechToTextCallback?: (audioBlob: Blob) => Promise<void>;
  useLocalState?: boolean;
  onStreamComplete?: (value: string) => void;
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
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.useLocalState === nextProps.useLocalState
  );
};

// Memoized FieldContainer component with forwardRef for streaming
const MemoizedFieldContainer = React.memo(
  forwardRef<FieldContainerHandle, MemoizedFieldContainerProps>(
    (
      {
        sendCallback,
        onCommit,
        stopCallback,
        value,
        instance,
        color,
        type,
        disabled = false,
        placeholder = "",
        speechToTextCallback,
        useLocalState = true,
        onStreamComplete,
      },
      ref
    ) => {
      return (
        <FieldContainer
          ref={ref}
          sendCallback={sendCallback}
          onCommit={onCommit}
          stopCallback={stopCallback}
          value={value}
          instance={instance}
          color={color}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          speechToTextCallback={speechToTextCallback}
          useLocalState={useLocalState}
          onStreamComplete={onStreamComplete}
        />
      );
    }
  ),
  arePropsEqual
);

MemoizedFieldContainer.displayName = "MemoizedFieldContainer";

export default MemoizedFieldContainer;
