import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { LlmProvider, LocalInterface, LocalMode } from "../models/RestInterface";
import useLlmSettingsStore, {
  defaultProviderSettings,
} from "../stores/llmSettingsStore";
import useNotificationStore from "../stores/notificationStore";

const PROVIDER_LABELS: Record<LlmProvider, string> = {
  [LlmProvider.LOCAL]: "Local",
  [LlmProvider.DEEPSEEK]: "DeepSeek",
  [LlmProvider.MINIMAX]: "MiniMax",
  [LlmProvider.OPENROUTER]: "OpenRouter",
};

const LOCAL_INTERFACE_LABELS: Record<LocalInterface, string> = {
  [LocalInterface.TEXTGEN_WEBUI]: "Text Generation WebUI",
  [LocalInterface.OLLAMA]: "Ollama (coming soon)",
};

const LOCAL_MODE_LABELS: Record<LocalMode, string> = {
  [LocalMode.NATIVE_COMPLETIONS]: "Native completions (reasoning warmstart)",
  [LocalMode.NATIVE_TOOL_CALLING]: "Native tool-calling",
};

// Sentinel for the model dropdown's "type your own model name" option —
// distinct from any real model id.
const CUSTOM_MODEL_VALUE = "__custom__";

// Providers whose model is free-text (matches the backend's per-provider
// model-name overrides — see LOCAL_MODEL/OPENROUTER_MODEL env vars in
// build_gamemaster()). DeepSeek/MiniMax use fixed chat/reasoning models.
const PROVIDERS_WITH_MODEL_FIELD = new Set([LlmProvider.OPENROUTER]);

// Local runs against a self-hosted server with no credential to enter.
const PROVIDERS_WITH_API_KEY = new Set([
  LlmProvider.DEEPSEEK,
  LlmProvider.MINIMAX,
  LlmProvider.OPENROUTER,
]);

type LlmSettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function LlmSettingsModal({ open, onClose }: LlmSettingsModalProps) {
  const {
    loaded,
    hasStoredSettings,
    activeProvider,
    perProvider,
    knownModels,
    loadSettings,
    saveSettings,
    resetSettings,
  } = useLlmSettingsStore();
  const showError = useNotificationStore((s) => s.showError);
  const showNotification = useNotificationStore((s) => s.showNotification);

  const [formProvider, setFormProvider] =
    React.useState<LlmProvider>(activeProvider);
  // The model dropdown's current selection — a known model id, or the
  // CUSTOM_MODEL_VALUE sentinel when the user is typing their own.
  const [formModelSelection, setFormModelSelection] = React.useState("");
  // Only used while formModelSelection === CUSTOM_MODEL_VALUE.
  const [formCustomModelName, setFormCustomModelName] = React.useState("");
  const [formApiKey, setFormApiKey] = React.useState("");
  const [formLocalHost, setFormLocalHost] = React.useState("");
  const [formLocalPort, setFormLocalPort] = React.useState(0);
  const [formLocalInterface, setFormLocalInterface] =
    React.useState<LocalInterface>(LocalInterface.TEXTGEN_WEBUI);
  const [formLocalMode, setFormLocalMode] = React.useState<LocalMode>(
    LocalMode.NATIVE_COMPLETIONS,
  );
  const [saving, setSaving] = React.useState(false);

  const isCustomModel = formModelSelection === CUSTOM_MODEL_VALUE;
  const matchedKnownModel = knownModels.find(
    (m) => m.id === formModelSelection,
  );
  // For OpenRouter (free-text) formModelSelection isn't used at all — its
  // own TextField below tracks formCustomModelName directly.
  const formModelName =
    formProvider === LlmProvider.LOCAL
      ? isCustomModel
        ? formCustomModelName
        : formModelSelection
      : formCustomModelName;

  // Populate the form fields from a given provider's saved settings. The API
  // key input always starts blank (the key is never sent back to the client).
  const applyProvider = React.useCallback(
    (nextProvider: LlmProvider) => {
      const s = perProvider[nextProvider] ?? defaultProviderSettings();
      setFormProvider(nextProvider);
      setFormApiKey("");
      setFormLocalHost(s.localHost);
      setFormLocalPort(s.localPort);
      setFormLocalInterface(s.localInterface);
      if (nextProvider === LlmProvider.LOCAL) {
        const known = knownModels.find((m) => m.id === s.modelName);
        if (known) {
          setFormModelSelection(known.id);
          setFormCustomModelName("");
          setFormLocalMode(known.mode);
        } else if (s.modelName) {
          // A previously saved custom model.
          setFormModelSelection(CUSTOM_MODEL_VALUE);
          setFormCustomModelName(s.modelName);
          setFormLocalMode(s.localMode);
        } else {
          // Nothing saved yet — default to the first known preset.
          const first = knownModels[0];
          setFormModelSelection(first?.id ?? CUSTOM_MODEL_VALUE);
          setFormCustomModelName("");
          setFormLocalMode(first?.mode ?? LocalMode.NATIVE_COMPLETIONS);
        }
      } else {
        setFormCustomModelName(s.modelName);
        setFormLocalMode(s.localMode);
      }
    },
    [perProvider, knownModels],
  );

  React.useEffect(() => {
    if (open) {
      loadSettings().catch((error) => {
        console.error("Failed to load LLM settings:", error);
        showError(
          error instanceof Error ? error.message : "Failed to load LLM settings.",
        );
      });
    }
  }, [open, loadSettings, showError]);

  // Once settings load, open the form on the active provider with its values.
  React.useEffect(() => {
    if (open && loaded) {
      applyProvider(activeProvider);
    }
    // applyProvider is intentionally omitted: it changes identity whenever
    // perProvider does, which would re-clobber in-progress edits. We only want
    // to (re)initialize when the modal opens or a fresh load completes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, loaded, activeProvider]);

  const currentProviderHasApiKey = perProvider[formProvider]?.hasApiKey ?? false;

  // Swapping the provider restores that provider's own saved settings rather
  // than carrying the current form's values over.
  const handleProviderChange = (nextProvider: LlmProvider) => {
    applyProvider(nextProvider);
  };

  // Which local client a known model needs (native-completions vs native-
  // tool-calling) is a property of the model, not a user choice — picking one
  // brings its mode along automatically. Picking "Custom" hands mode choice
  // to the user instead, since it genuinely can't be derived for a model we
  // don't know anything about.
  const handleModelSelectionChange = (value: string) => {
    setFormModelSelection(value);
    if (value === CUSTOM_MODEL_VALUE) {
      setFormLocalMode(LocalMode.NATIVE_COMPLETIONS);
    } else {
      const known = knownModels.find((m) => m.id === value);
      setFormLocalMode(known?.mode ?? LocalMode.NATIVE_COMPLETIONS);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    try {
      await resetSettings();
      showNotification("Reverted to the server's default LLM.", "success");
      onClose();
    } catch (error) {
      console.error("Failed to reset LLM settings:", error);
      showError(
        error instanceof Error ? error.message : "Failed to reset LLM settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async () => {
    setSaving(true);
    try {
      await saveSettings({
        provider: formProvider,
        modelName: formModelName,
        apiKey: formApiKey,
        localHost: formLocalHost,
        localPort: formLocalPort,
        localInterface: formLocalInterface,
        localMode: formLocalMode,
      });
      showNotification("LLM settings saved.", "success");
      onClose();
    } catch (error) {
      console.error("Failed to save LLM settings:", error);
      showError(
        error instanceof Error ? error.message : "Failed to save LLM settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>LLM Settings</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }} color="text.secondary">
          Choose which LLM provider and model the gamemaster uses for your
          missions, and supply an API key if the provider requires one.
        </Typography>

        <TextField
          select
          label="Provider"
          value={formProvider}
          onChange={(e) => handleProviderChange(e.target.value as LlmProvider)}
          fullWidth
          sx={{ mt: 1 }}
        >
          {Object.values(LlmProvider).map((p) => (
            <MenuItem key={p} value={p}>
              {PROVIDER_LABELS[p]}
            </MenuItem>
          ))}
        </TextField>

        {formProvider === LlmProvider.LOCAL && (
          <>
            <TextField
              select
              label="Interface"
              value={formLocalInterface}
              onChange={(e) =>
                setFormLocalInterface(e.target.value as LocalInterface)
              }
              fullWidth
              sx={{ mt: 3 }}
            >
              {Object.values(LocalInterface).map((i) => (
                <MenuItem
                  key={i}
                  value={i}
                  disabled={i !== LocalInterface.TEXTGEN_WEBUI}
                >
                  {LOCAL_INTERFACE_LABELS[i]}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <TextField
                label="Host"
                value={formLocalHost}
                onChange={(e) => setFormLocalHost(e.target.value)}
                placeholder="127.0.0.1"
                sx={{ flex: 2 }}
              />
              <TextField
                label="Port"
                type="number"
                value={formLocalPort}
                onChange={(e) => setFormLocalPort(Number(e.target.value) || 0)}
                placeholder="5000"
                sx={{ flex: 1 }}
              />
            </Box>

            <TextField
              select
              label="Model"
              value={formModelSelection}
              onChange={(e) => handleModelSelectionChange(e.target.value)}
              fullWidth
              disabled={knownModels.length === 0}
              helperText={
                knownModels.length === 0
                  ? "Loading supported models…"
                  : undefined
              }
              sx={{ mt: 3 }}
            >
              {knownModels.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.label}
                </MenuItem>
              ))}
              <MenuItem value={CUSTOM_MODEL_VALUE}>
                Custom (type your own model name)…
              </MenuItem>
            </TextField>

            {matchedKnownModel && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Client mode: {LOCAL_MODE_LABELS[formLocalMode]}
              </Typography>
            )}

            {isCustomModel && (
              <>
                <TextField
                  label="Model name"
                  value={formCustomModelName}
                  onChange={(e) => setFormCustomModelName(e.target.value)}
                  fullWidth
                  placeholder="e.g. the model name/filename textgen-webui reports"
                  sx={{ mt: 3 }}
                />

                <TextField
                  select
                  label="Client mode"
                  value={formLocalMode}
                  onChange={(e) =>
                    setFormLocalMode(e.target.value as LocalMode)
                  }
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  {Object.values(LocalMode).map((m) => (
                    <MenuItem key={m} value={m}>
                      {LOCAL_MODE_LABELS[m]}
                    </MenuItem>
                  ))}
                </TextField>

                <Typography
                  variant="body2"
                  color={
                    formLocalMode === LocalMode.NATIVE_TOOL_CALLING
                      ? "warning.main"
                      : "text.secondary"
                  }
                  sx={{ mt: 1 }}
                >
                  {formLocalMode === LocalMode.NATIVE_TOOL_CALLING
                    ? "Experimental: requires your model's chat template to " +
                      "support tool-calling, and uses sampling tuned for " +
                      "Gemma 4-class models — results may vary for other " +
                      "models."
                    : "Works with any model served over textgen-webui's " +
                      "native completions endpoint."}
                </Typography>
              </>
            )}
          </>
        )}

        {PROVIDERS_WITH_MODEL_FIELD.has(formProvider) && (
          <TextField
            label="Model name"
            value={formCustomModelName}
            onChange={(e) => setFormCustomModelName(e.target.value)}
            fullWidth
            placeholder="e.g. deepseek/deepseek-v4-flash"
            sx={{ mt: 3 }}
          />
        )}

        {PROVIDERS_WITH_API_KEY.has(formProvider) && (
          <TextField
            label="API key"
            type="password"
            value={formApiKey}
            onChange={(e) => setFormApiKey(e.target.value)}
            fullWidth
            placeholder={
              currentProviderHasApiKey
                ? "•••••••••••••• (saved — leave blank to keep it)"
                : "Enter API key"
            }
            sx={{ mt: 3 }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleReset}
          color="secondary"
          disabled={saving || !hasStoredSettings}
        >
          Reset to server default
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onClose} color="warning" sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" disabled={saving}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
