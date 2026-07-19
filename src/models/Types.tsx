export enum GameType {
  SHADOWRUN = "shadowrun",
  VAMPIRE_THE_MASQUERADE = "vampire_the_masquerade",
  CALL_OF_CTHULHU = "call_of_cthulhu",
  SEVENTH_SEA = "seventh_sea",
  EXPANSE = "expanse",
  SLAVIC = "slavic",
  DRAGONLANCE = "dragonlance",
  DESOLATE_FRONTIER = "desolate_frontier",
  CUSTOM = "custom",
}

// Generic equipment slots a character sheet can request catalog suggestions
// for; not every GameType supports every slot (see getEquipmentTypes in
// restInterface.tsx — only Shadowrun currently has CYBERWARE).
export enum EquipmentType {
  WEAPONS = "weapons",
  ARMOR = "armor",
  CYBERWARE = "cyberware",
  GEAR = "gear",
}

// One catalog item as returned by the backend's equipment-suggestion
// endpoint. Field coverage varies per system/item (e.g. Shadowrun items lack
// `damage`, Expanse items use `availability_tn` instead of `cost`) — only
// `name` is guaranteed.
export interface EquipmentItem {
  name: string;
  category?: string;
  subcategory?: string;
  cost?: string | number;
  damage?: string;
  type?: string;
  availability?: string;
  availability_tn?: string | number;
  notes?: string;
}

export enum TtsVoice {
  Callum = "Callum",
  CaraGee = "CaraGee",
  JoeyCocoDiaz = "JoeyCocoDiaz",
  MelHudson = "MelHudson",
  ShohrehAghdashloo = "ShohrehAghdashloo",
  StephenFry = "StephenFry",
  DavidStrathairn = "DavidStrathairn",
  Drummer = "Drummer",
  NeilGaiman = "NeilGaiman",
  LeonardNimoy = "LeonardNimoy",
  RayPorter = "RayPorter",
  JasonCarl = "JasonCarl",
  PoE2_Witch = "PoE2_Witch",
  PoE2_Shambrin = "PoE2_Shambrin",
  PoE2_Servi = "PoE2_Servi",
  PoE2_Doryani = "PoE2_Doryani",
  PoE2_Tavakai = "PoE2_Tavakai",
  Cyberpunk_Brigitte = "Cyberpunk_Brigitte",
}
