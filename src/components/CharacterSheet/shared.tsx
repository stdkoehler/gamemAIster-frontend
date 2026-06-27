import React from "react";
import {
  Box,
  Typography,
  TextField,
  Divider,
  Chip,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";

// =====================
// Dot Rating (1-N clickable dots)
// =====================

interface DotRatingProps {
  value: number;
  max?: number;
  onChange?: (n: number) => void;
  size?: number;
}

export const DotRating: React.FC<DotRatingProps> = ({
  value,
  max = 5,
  onChange,
  size = 10,
}) => (
  <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
    {Array.from({ length: max }).map((_, i) => (
      <Box
        key={i}
        onClick={() => onChange && onChange(i + 1 === value ? i : i + 1)}
        sx={{
          width: size,
          height: size,
          borderRadius: "50%",
          cursor: onChange ? "pointer" : "default",
          bgcolor: i < value ? "primary.main" : "transparent",
          border: "1px solid",
          borderColor: "primary.main",
          flexShrink: 0,
          transition: "background-color 0.1s",
        }}
      />
    ))}
  </Box>
);

// =====================
// Section header with divider
// =====================

interface SheetSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SheetSection: React.FC<SheetSectionProps> = ({
  title,
  children,
}) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
      <Typography
        variant="overline"
        sx={{
          fontWeight: "bold",
          letterSpacing: "0.15em",
          lineHeight: 1,
          fontSize: "0.9rem",
        }}
      >
        {title}
      </Typography>
      <Divider sx={{ flex: 1 }} />
    </Box>
    {children}
  </Box>
);

// =====================
// Labeled row wrapper
// =====================

interface FieldRowProps {
  label: string;
  children: React.ReactNode;
  inline?: boolean;
}

export const FieldRow: React.FC<FieldRowProps> = ({
  label,
  children,
  inline = true,
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: inline ? "row" : "column",
      alignItems: inline ? "center" : "flex-start",
      gap: 0.5,
      mb: 0.5,
    }}
  >
    <Typography
      variant="caption"
      sx={{ minWidth: inline ? 100 : undefined, color: "text.secondary" }}
    >
      {label}:
    </Typography>
    {children}
  </Box>
);

// =====================
// Compact number input
// =====================

interface NumInputProps {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  width?: number | string;
  float?: boolean;
  step?: number;
}

export const NumInput: React.FC<NumInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 999,
  width,
  float = false,
  step,
}) => {
  const resolvedWidth = width ?? (float ? 80 : 64);
  const theme = useTheme();
  const color = theme.palette.primary.main;
  const resolvedStep = step ?? (float ? 0.1 : 1);
  return (
    <TextField
      type="number"
      value={value}
      onChange={(e) => {
        const n = float ? parseFloat(e.target.value) : parseInt(e.target.value);
        if (!isNaN(n) && n >= min && n <= max) onChange(n);
      }}
      variant="outlined"
      size="small"
      inputProps={{
        min,
        max,
        step: resolvedStep,
        style: { textAlign: "center", padding: "4px 2.2em 4px 6px" },
      }}
      sx={{
        width: resolvedWidth,
        "& input[type=number]::-webkit-inner-spin-button": {
          WebkitAppearance: "none",
          background: `${theme.spinButtonBackgroundImage(color)} no-repeat`,
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
      }}
    />
  );
};

// =====================
// Text field (controlled, blurs to update)
// =====================

interface TextInputProps {
  value: string;
  onChange: (s: string) => void;
  label?: string;
  multiline?: boolean;
  rows?: number;
  fullWidth?: boolean;
  placeholder?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  label,
  multiline,
  rows,
  fullWidth = true,
  placeholder,
}) => {
  const [local, setLocal] = React.useState(value);
  React.useEffect(() => {
    setLocal(value);
  }, [value]);
  return (
    <TextField
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => {
        if (local !== value) onChange(local);
      }}
      label={label}
      multiline={multiline}
      rows={rows}
      fullWidth={fullWidth}
      variant="outlined"
      size="small"
      placeholder={placeholder}
    />
  );
};

// =====================
// List editor (one item per line in a textarea)
// =====================

interface ListEditorProps {
  value: string[];
  onChange: (items: string[]) => void;
  label?: string;
  rows?: number;
  placeholder?: string;
}

export const ListEditor: React.FC<ListEditorProps> = ({
  value,
  onChange,
  label,
  rows = 3,
  placeholder = "One item per line",
}) => {
  const joined = value.join("\n");
  const [local, setLocal] = React.useState(joined);
  React.useEffect(() => {
    setLocal(value.join("\n"));
  }, [value]);
  return (
    <TextField
      multiline
      rows={rows}
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => {
        const items = local
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        onChange(items);
      }}
      label={label}
      variant="outlined"
      size="small"
      fullWidth
      placeholder={placeholder}
    />
  );
};

// =====================
// Chip list with add/remove
// =====================

interface ChipListEditorProps {
  value: string[];
  onChange: (items: string[]) => void;
  label?: string;
}

export const ChipListEditor: React.FC<ChipListEditorProps> = ({
  value,
  onChange,
  label,
}) => {
  const [newItem, setNewItem] = React.useState("");
  const add = () => {
    const trimmed = newItem.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setNewItem("");
    }
  };
  return (
    <Box>
      {label && (
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {label}:
        </Typography>
      )}
      <Box
        sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5, mb: 0.5 }}
      >
        {value.map((item) => (
          <Chip
            key={item}
            label={item}
            size="small"
            onDelete={() => onChange(value.filter((v) => v !== item))}
          />
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <TextField
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          size="small"
          placeholder="Add item..."
          sx={{ flex: 1 }}
        />
        <IconButton size="small" onClick={add}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

// =====================
// Record<string, number> editor (name → value table)
// =====================

interface RecordNumEditorProps {
  value: Record<string, number>;
  onChange: (r: Record<string, number>) => void;
  label?: string;
  useDots?: boolean;
  maxDots?: number;
  fixedKeys?: boolean;
}

export const RecordNumEditor: React.FC<RecordNumEditorProps> = ({
  value,
  onChange,
  label,
  useDots = false,
  maxDots = 5,
  fixedKeys = false,
}) => {
  const [newKey, setNewKey] = React.useState("");
  const addKey = () => {
    const k = newKey.trim();
    if (k && !(k in value)) {
      onChange({ ...value, [k]: 0 });
      setNewKey("");
    }
  };
  return (
    <Box>
      {label && (
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
        >
          {label}:
        </Typography>
      )}
      {Object.entries(value).map(([k, v]) => (
        <Box
          key={k}
          sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}
        >
          <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }}>
            {k}
          </Typography>
          {useDots ? (
            <DotRating
              value={v}
              max={maxDots}
              onChange={(n) => onChange({ ...value, [k]: n })}
            />
          ) : (
            <NumInput
              value={v}
              onChange={(n) => onChange({ ...value, [k]: n })}
            />
          )}
          {!fixedKeys && (
            <IconButton
              size="small"
              onClick={() => {
                const next = { ...value };
                delete next[k];
                onChange(next);
              }}
              sx={{ p: 0.25 }}
            >
              ×
            </IconButton>
          )}
        </Box>
      ))}
      {!fixedKeys && (
        <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
          <TextField
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addKey();
              }
            }}
            size="small"
            placeholder="Add entry..."
            sx={{ flex: 1 }}
          />
          <IconButton size="small" onClick={addKey}>
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

// =====================
// Two-column layout helper
// =====================

interface TwoColProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftFlex?: number;
  rightFlex?: number;
}

export const TwoCol: React.FC<TwoColProps> = ({
  left,
  right,
  leftFlex = 1,
  rightFlex = 1,
}) => (
  <Box sx={{ display: "flex", gap: 2 }}>
    <Box sx={{ flex: leftFlex }}>{left}</Box>
    <Box sx={{ flex: rightFlex }}>{right}</Box>
  </Box>
);
