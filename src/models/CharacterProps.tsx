export interface CharacterProps {
  name: string;
  id: number;
  race: string;
  role: string;
  description: string;
  attributes: {
    [key: string]: number;
  };
  skills: {
    [key: string]: number;
  };
  armor: number;
  weapon: string;
  cyberware: string[];
  damage: {
    physical: {
      current: number;
      max: number;
    };
    stun: {
      current: number;
      max: number;
    };
  };
}
