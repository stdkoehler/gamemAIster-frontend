import * as React from "react";
import { ComponentProps } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";

import Typography from "@mui/material/Typography";
import {
  TextField,
  Autocomplete,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  TextfieldStyle,
  ModalStyle,
  MenuStyle,
  AutocompleteStyle,
  Colors,
  AutocompletePaper,
} from "../styles/styles";

// Import MissionOption from centralized model
import { Mission } from "../models/MissionModels";
import { GameType } from "../models/Types";

enum ModalNames {
  CLOSED = "closed",
  NEW = "new",
  SAVE = "save",
  LOAD = "load",
  LOADING = "loading",
}

type StyledTextFieldProps = ComponentProps<typeof TextField> & {
  color: Colors;
};

export const StyledTextField = React.memo(
  ({ color, ...props }: StyledTextFieldProps) => {
    return (
      <TextField {...props} color={color} sx={TextfieldStyle({ color })} />
    );
  }
);

type NewMissionModalComponentProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedGame: GameType, background: string) => void;
};

const LoadingModal = ({ open }: { open: boolean }) => (
  <Modal
    open={open}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={ModalStyle()}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography sx={{ margin: "0px 0px 20px 0px" }}>
          Generating new Mission
        </Typography>
        <CircularProgress />
      </Box>
    </Box>
  </Modal>
);

const NewMissionModal = ({
  open,
  onClose,
  onConfirm,
}: NewMissionModalComponentProps) => {
  const theme = useTheme();
  const [selectedGame, setSelectedGame] = React.useState(GameType.SHADOWRUN);
  const [background, setBackground] = React.useState("");

  const handleGameChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedGame(event.target.value as GameType);
  };

  const handleBackgroundChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBackground(event.target.value);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={ModalStyle()}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          New Mission
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Are you sure you want to proceed? This will delete your current
          mission.
        </Typography>
        <TextField
          select
          label="Select Game"
          value={selectedGame}
          onChange={handleGameChange}
          fullWidth
          sx={{ mt: 2 }}
        >
          <MenuItem value={GameType.SHADOWRUN}>Shadowrun</MenuItem>
          <MenuItem value={GameType.VAMPIRE_THE_MASQUERADE}>
            Vampire The Masquerade
          </MenuItem>
          <MenuItem value={GameType.CALL_OF_CTHULHU}>Call of Cthulhu</MenuItem>
        </TextField>
        <TextField
          label="Background"
          value={background}
          onChange={handleBackgroundChange}
          fullWidth
          multiline
          rows={10}
          sx={{
            mt: 3,
            "& .MuiInputBase-input.MuiOutlinedInput-input": {
              ...theme.scrollbarStyles(theme),
            },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={onClose} color="warning">
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(selectedGame, background)}
            color="primary"
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

type SaveMissionModalComponentProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  value: string;
  onValueChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const SaveMissionModal = ({
  open,
  onClose,
  onConfirm,
  value,
  onValueChange,
}: SaveMissionModalComponentProps) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={ModalStyle()}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Save Mission
      </Typography>
      <StyledTextField
        value={value}
        color={"primary"}
        disabled={false}
        onChange={onValueChange}
        rows={1}
      />
      <Button onClick={onClose} color="warning">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="primary">
        Confirm
      </Button>
    </Box>
  </Modal>
);

type LoadMissionModalComponentProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  missions: Mission[] | null;
  selectedMission: Mission | null;
  setSelectedMission: React.Dispatch<React.SetStateAction<Mission | null>>;
};

function FilterableLoadMissionModal({
  open,
  onClose,
  onConfirm,
  missions,
  selectedMission,
  setSelectedMission,
}: LoadMissionModalComponentProps) {
  const [selectedGameType, setSelectedGameType] =
    React.useState<GameType | null>(null);

  const handleMissionChange = (
    _: React.SyntheticEvent<Element, Event>,
    newValue: Mission | null
  ) => {
    setSelectedMission(newValue);
  };

  const handleGameTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedGameType(event.target.value as GameType);
  };

  const filteredMissions = React.useMemo(() => {
    if (!selectedGameType) return missions || [];
    return (missions || []).filter(
      (mission) => mission.gameType === selectedGameType
    );
  }, [missions, selectedGameType]);

  React.useEffect(() => {
    if (
      selectedMission &&
      selectedGameType &&
      selectedMission.gameType !== selectedGameType
    ) {
      setSelectedMission(null);
    }
  }, [selectedMission, selectedGameType]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={ModalStyle()}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Load Mission
        </Typography>
        <TextField
          select
          label="Filter by Game Type"
          value={selectedGameType || ""}
          onChange={handleGameTypeChange}
          fullWidth
          sx={{ mt: 2 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value={GameType.SHADOWRUN}>Shadowrun</MenuItem>
          <MenuItem value={GameType.VAMPIRE_THE_MASQUERADE}>
            Vampire The Masquerade
          </MenuItem>
          <MenuItem value={GameType.CALL_OF_CTHULHU}>Call of Cthulhu</MenuItem>
        </TextField>
        <Autocomplete
          value={selectedMission}
          onChange={handleMissionChange}
          disablePortal
          PaperComponent={AutocompletePaper}
          options={filteredMissions}
          getOptionLabel={(option) => option.nameCustom || option.name}
          sx={{ ...AutocompleteStyle, mt: 2 }}
          renderInput={(params) => <TextField {...params} label="Mission" />}
        />
        <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
          Are you sure you want to proceed? This will delete your current
          mission.
        </Typography>
        <Button onClick={onClose} color="warning">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary">
          Confirm
        </Button>
      </Box>
    </Modal>
  );
}

type MissionMenuComponentProps = {
  newCallback: (gameType: GameType, background: string) => Promise<void>;
  saveCallback: (nameCustom: string) => Promise<void>;
  listCallback: () => Promise<Mission[]>;
  loadCallback: (missionId: number) => Promise<void>;
};

export function MissionMenu({
  newCallback,
  saveCallback,
  listCallback,
  loadCallback,
}: MissionMenuComponentProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [activeModal, setActiveModal] = React.useState<ModalNames>(
    ModalNames.CLOSED
  );
  const [saveModalValue, setSaveModalValue] = React.useState("");
  const [missionList, setMissionList] = React.useState<Mission[] | null>(null);
  const [selectedMission, setSelectedMission] = React.useState<Mission | null>(
    null
  );

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNewMenuItem = () => {
    setAnchorEl(null);
    handleModalOpen(ModalNames.NEW);
  };

  const handleSaveMenuItem = () => {
    setAnchorEl(null);
    handleModalOpen(ModalNames.SAVE);
  };

  const handleLoadMenuItem = () => {
    setAnchorEl(null);
    handleModalOpen(ModalNames.LOAD);
  };

  // modals

  const handleModalOpen = React.useCallback(
    async (modalName: ModalNames) => {
      if (modalName === ModalNames.LOAD) {
        try {
          const missions = await listCallback();
          setMissionList(missions);
          setSelectedMission(missions[0]);
        } catch (error) {
          console.error("An error occurred:", error);
        }
      }
      setActiveModal(modalName);
    },
    [listCallback]
  );

  const handleModalClose = React.useCallback(() => {
    setActiveModal(ModalNames.CLOSED);
  }, []);

  // New

  const handleNewModalConfirm = React.useCallback(
    async (selectedGame: GameType, background: string) => {
      handleModalClose();
      setActiveModal(ModalNames.LOADING);
      try {
        await newCallback(selectedGame, background);
      } catch (error) {
        console.error("An error occurred:", error);
      }
      setActiveModal(ModalNames.CLOSED);
    },
    [newCallback, handleModalClose]
  );

  // Save

  const handleSaveModalConfirm = React.useCallback(async () => {
    handleModalClose();
    setActiveModal(ModalNames.LOADING);
    try {
      await saveCallback(saveModalValue);
    } catch (error) {
      console.error("An error occurred:", error);
    }
    setActiveModal(ModalNames.CLOSED);
  }, [saveCallback, saveModalValue, handleModalClose]);

  const handleSaveModalValueChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (event.target.value !== undefined) {
      setSaveModalValue(event.target.value);
    }
  };

  const handleLoadModalConfirm = React.useCallback(async () => {
    handleModalClose();
    setActiveModal(ModalNames.LOADING);
    if (selectedMission) {
      try {
        await loadCallback(selectedMission.missionId);
      } catch (error) {
        console.error("An error occurred:", error);
      }
      setActiveModal(ModalNames.CLOSED);
    }
  }, [selectedMission, handleModalClose]);

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Mission
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        color="primary"
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={MenuStyle()}
      >
        <MenuItem onClick={handleNewMenuItem}>New Mission</MenuItem>
        <MenuItem onClick={handleSaveMenuItem}>Save Mission</MenuItem>
        <MenuItem onClick={handleLoadMenuItem}>Load Mission</MenuItem>
      </Menu>

      <LoadingModal open={activeModal === ModalNames.LOADING} />
      <NewMissionModal
        open={activeModal === ModalNames.NEW}
        onClose={handleModalClose}
        onConfirm={(gameType, background) =>
          handleNewModalConfirm(gameType, background)
        }
      />
      <SaveMissionModal
        open={activeModal === ModalNames.SAVE}
        onClose={handleModalClose}
        onConfirm={handleSaveModalConfirm}
        value={saveModalValue}
        onValueChange={handleSaveModalValueChange}
      />
      <FilterableLoadMissionModal
        open={activeModal === ModalNames.LOAD}
        onClose={handleModalClose}
        onConfirm={handleLoadModalConfirm}
        missions={missionList}
        selectedMission={selectedMission}
        setSelectedMission={setSelectedMission}
      />
    </div>
  );
}
