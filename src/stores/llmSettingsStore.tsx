import { create } from "zustand";
import {
  getLlmSettings,
  saveLlmSettings,
  deleteLlmSettings,
  getKnownLocalModels,
} from "../functions/restInterface";
import {
  LlmProvider,
  LocalInterface,
  LocalMode,
  KnownLocalModel,
} from "../models/RestInterface";

const DEFAULT_LOCAL_HOST = "127.0.0.1";
const DEFAULT_LOCAL_PORT = 5000;

/** One provider's settings as held client-side. The API key is never cached
 * (write-only from the client's side) — `hasApiKey` is the only signal. */
export interface ProviderSettings {
  modelName: string;
  hasApiKey: boolean;
  localHost: string;
  localPort: number;
  localInterface: LocalInterface;
  localMode: LocalMode;
}

export const defaultProviderSettings = (): ProviderSettings => ({
  modelName: "",
  hasApiKey: false,
  localHost: DEFAULT_LOCAL_HOST,
  localPort: DEFAULT_LOCAL_PORT,
  localInterface: LocalInterface.TEXTGEN_WEBUI,
  localMode: LocalMode.NATIVE_COMPLETIONS,
});

type PerProvider = Record<LlmProvider, ProviderSettings>;

const defaultPerProvider = (): PerProvider =>
  Object.values(LlmProvider).reduce((acc, p) => {
    acc[p] = defaultProviderSettings();
    return acc;
  }, {} as PerProvider);

interface LlmSettingsState {
  loaded: boolean;
  /** Whether the backend has any stored provider settings for this user (vs.
   * falling back to the deployment's env-var default). Drives "Reset". */
  hasStoredSettings: boolean;
  /** The provider build_gamemaster currently uses; also which one the modal
   * opens on. */
  activeProvider: LlmProvider;
  /** Each provider's saved settings, so swapping providers restores them.
   * Providers the user never configured hold defaults. */
  perProvider: PerProvider;
  knownModels: KnownLocalModel[];

  loadSettings: () => Promise<void>;
  saveSettings: (params: {
    provider: LlmProvider;
    modelName: string;
    apiKey: string;
    localHost: string;
    localPort: number;
    localInterface: LocalInterface;
  }) => Promise<void>;
  resetSettings: () => Promise<void>;
}

/** Mirrors the backend's known_local_models.mode_for(): which local client a
 * model needs is a property of the model, not something the caller picks —
 * resolved here purely for client-side display, never sent to the backend. */
const modeForModel = (
  knownModels: KnownLocalModel[],
  modelName: string,
): LocalMode =>
  knownModels.find((m) => m.id === modelName)?.mode ??
  LocalMode.NATIVE_COMPLETIONS;

const useLlmSettingsStore = create<LlmSettingsState>()((set, get) => ({
  loaded: false,
  hasStoredSettings: false,
  activeProvider: LlmProvider.LOCAL,
  perProvider: defaultPerProvider(),
  knownModels: [],

  loadSettings: async () => {
    const [overview, knownModels] = await Promise.all([
      getLlmSettings(),
      getKnownLocalModels(),
    ]);
    const perProvider = defaultPerProvider();
    for (const p of overview.providers) {
      perProvider[p.provider] = {
        modelName: p.model_name ?? "",
        hasApiKey: p.has_api_key,
        localHost: p.local_host ?? DEFAULT_LOCAL_HOST,
        localPort: p.local_port ?? DEFAULT_LOCAL_PORT,
        localInterface: p.local_interface ?? LocalInterface.TEXTGEN_WEBUI,
        localMode: p.local_mode ?? LocalMode.NATIVE_COMPLETIONS,
      };
    }
    set({
      loaded: true,
      hasStoredSettings: overview.providers.length > 0,
      activeProvider: overview.active_provider ?? LlmProvider.LOCAL,
      perProvider,
      knownModels,
    });
  },

  saveSettings: async ({
    provider,
    modelName,
    apiKey,
    localHost,
    localPort,
    localInterface,
  }) => {
    const isLocal = provider === LlmProvider.LOCAL;
    // DeepSeek/MiniMax use fixed models — only LOCAL and OpenRouter carry a
    // model name, so don't persist a stale one under the others.
    const usesModel =
      provider === LlmProvider.LOCAL || provider === LlmProvider.OPENROUTER;
    await saveLlmSettings({
      provider,
      model_name: usesModel ? modelName || null : null,
      api_key: apiKey || null,
      local_host: isLocal ? localHost || DEFAULT_LOCAL_HOST : null,
      local_port: isLocal ? localPort || DEFAULT_LOCAL_PORT : null,
      local_interface: isLocal ? localInterface : null,
    });
    set((state) => {
      const prev = state.perProvider[provider] ?? defaultProviderSettings();
      return {
        hasStoredSettings: true,
        activeProvider: provider,
        perProvider: {
          ...state.perProvider,
          [provider]: {
            modelName: usesModel ? modelName : "",
            // A blank save keeps the previously stored key for this provider.
            hasApiKey: apiKey ? true : prev.hasApiKey,
            localHost,
            localPort,
            localInterface,
            localMode: isLocal
              ? modeForModel(state.knownModels, modelName)
              : prev.localMode,
          },
        },
      };
    });
  },

  resetSettings: async () => {
    await deleteLlmSettings();
    // Re-fetch so the store reflects the env-var default the backend now uses.
    await get().loadSettings();
  },
}));

export default useLlmSettingsStore;
