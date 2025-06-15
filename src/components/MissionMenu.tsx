import * as React from "react";
import { ComponentProps } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import Typography from "@mui/material/Typography";
import {
  TextField,
  Autocomplete,
  CircularProgress,
  useTheme,
  Switch,
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

/**
 * Enum for managing the state of active modals within the MissionMenu.
 */
enum ModalNames {
  /** Indicates that no modal is currently open. */
  CLOSED = "closed",
  /** Indicates that the "New Mission" modal is active. */
  NEW = "new",
  /** Indicates that the "Save Mission" modal is active. */
  SAVE = "save",
  /** Indicates that the "Load Mission" modal is active. */
  LOAD = "load",
  /** Indicates that a generic loading modal is active (e.g., during API calls). */
  LOADING = "loading",
}

/**
 * Props for the StyledTextField component.
 * Extends MUI TextField props and adds a custom `color` prop.
 */
type StyledTextFieldProps = ComponentProps<typeof TextField> & {
  /** The color theme for the text field. See {@link Colors}. */
  color: Colors;
};

/**
 * StyledTextField is a memoized wrapper around MUI's TextField component.
 * It applies custom styling defined in `TextfieldStyle`.
 *
 * @param props - The props for the component. See {@link StyledTextFieldProps}.
 * @returns The StyledTextField component.
 */
export const StyledTextField = React.memo(
  ({ color, ...props }: StyledTextFieldProps) => {
    return (
      <TextField {...props} color={color} sx={TextfieldStyle({ color })} />
    );
  }
);

/**
 * Props for the NewMissionModal component.
 */
type NewMissionModalComponentProps = {
  /** Whether the modal is currently open. */
  open: boolean;
  /** Callback function to close the modal. */
  onClose: () => void;
  /** Callback function to confirm the new mission creation, passing the selected game type, background, and nonHeroMode. */
  onConfirm: (
    selectedGame: GameType,
    background: string,
    nonHeroMode: boolean
  ) => void;
};

/**
 * LoadingModal is a simple modal component that displays a loading spinner and message.
 * It is used to indicate that an operation (like generating a new mission) is in progress.
 *
 * @param props - The props for the component.
 * @param props.open - Whether the modal is currently open.
 * @returns The LoadingModal component.
 */
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

const gamesWithHeroModeSwitch = [GameType.EXPANSE]; // Add more GameTypes as needed

const NewMissionModal = ({
  open,
  onClose,
  onConfirm,
}: NewMissionModalComponentProps) => {
  const theme = useTheme();
  const [selectedGame, setSelectedGame] = React.useState(GameType.SHADOWRUN);
  const [background, setBackground] = React.useState("");
  const [nonHeroMode, setNonHeroMode] = React.useState(false);

  const handleGameChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedGame(event.target.value as GameType);
    setNonHeroMode(false);
  };

  const handleBackgroundChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBackground(event.target.value);
  };

  const handleNonHeroModeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNonHeroMode(event.target.checked);
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
          <MenuItem value={GameType.SEVENTH_SEA}>Seventh Sea</MenuItem>
          <MenuItem value={GameType.EXPANSE}>The Expanse</MenuItem>
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
        {gamesWithHeroModeSwitch.includes(selectedGame) && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Typography sx={{ mr: 1 }}>Non-Hero Mode</Typography>
            <Tooltip
              title={`Non-Hero Mode for less dramatic missions. You're just a normal person in the ${selectedGame} world. Providing some background info on what you want to play is strongly recommended.`}
              enterTouchDelay={0}
              leaveTouchDelay={3000}
              arrow
            >
              <InfoOutlinedIcon
                color="info"
                sx={{ fontSize: 20, cursor: "pointer", mr: 2 }}
              />
            </Tooltip>
            <Switch
              checked={nonHeroMode}
              onChange={handleNonHeroModeChange}
              id="non-hero-mode-switch"
              color="info"
            />
          </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={onClose} color="warning">
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(selectedGame, background, nonHeroMode)}
            color="primary"
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

/**
 * Props for the SaveMissionModal component.
 */
type SaveMissionModalComponentProps = {
  /** Whether the modal is currently open. */
  open: boolean;
  /** Callback function to close the modal. */
  onClose: () => void;
  /** Callback function to confirm saving the mission. */
  onConfirm: () => void;
  /** The current value of the mission name input field. */
  value: string;
  /** Callback function for changes to the mission name input field. */
  onValueChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

/**
 * SaveMissionModal is a component that provides a dialog for saving the current mission.
 * It includes a text field for the user to name the mission.
 *
 * @param props - The props for the component. See {@link SaveMissionModalComponentProps}.
 * @returns The SaveMissionModal component.
 */
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

/**
 * Props for the FilterableLoadMissionModal component.
 */
type LoadMissionModalComponentProps = {
  /** Whether the modal is currently open. */
  open: boolean;
  /** Callback function to close the modal. */
  onClose: () => void;
  /** Callback function to confirm loading the selected mission. */
  onConfirm: () => void;
  /** Array of available missions to load, or null if not yet fetched. */
  missions: Mission[] | null;
  /** The currently selected mission in the Autocomplete field. */
  selectedMission: Mission | null;
  /** Setter function for updating the selectedMission state. */
  setSelectedMission: React.Dispatch<React.SetStateAction<Mission | null>>;
};

/**
 * FilterableLoadMissionModal is a component that provides a dialog for loading a previously saved mission.
 * It features an Autocomplete field to select a mission and a dropdown to filter missions by game type.
 *
 * @param props - The props for the component. See {@link LoadMissionModalComponentProps}.
 * @returns The FilterableLoadMissionModal component.
 */
function FilterableLoadMissionModal({
  open,
  onClose,
  onConfirm,
  missions,
  selectedMission,
  setSelectedMission,
}: LoadMissionModalComponentProps) {
  /** State for the currently selected game type filter. `null` means no filter. */
  const [selectedGameType, setSelectedGameType] =
    React.useState<GameType | null>(null);

  /**
   * Handles changes to the selected mission in the Autocomplete field.
   * @param _ - The event source of the callback.
   * @param newValue - The newly selected mission, or null.
   */
  const handleMissionChange = (
    _: React.SyntheticEvent<Element, Event>,
    newValue: Mission | null
  ) => {
    setSelectedMission(newValue);
  };

  /**
   * Handles changes to the selected game type filter.
   * @param event - The change event from the game type filter selection field.
   */
  const handleGameTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedGameType(event.target.value as GameType);
  };

  /**
   * Memoized list of missions filtered by the selected game type.
   * If no game type is selected, it returns all missions.
   */
  const filteredMissions = React.useMemo(() => {
    if (!selectedGameType) return missions || [];
    return (missions || []).filter(
      (mission) => mission.gameType === selectedGameType
    );
  }, [missions, selectedGameType]);

  /**
   * Effect to clear the selected mission if the selected game type filter
   * changes and the current selected mission does not match the new filter.
   */
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
          <MenuItem value={GameType.SEVENTH_SEA}>Seventh Sea</MenuItem>
          <MenuItem value={GameType.EXPANSE}>The Expanse</MenuItem>
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

/**
 * Props for the MissionMenu component.
 */
type MissionMenuComponentProps = {
  /** Callback function to initiate the creation of a new mission.
   * Takes the selected game type, background story, and nonHeroMode as arguments.
   */
  newCallback: (
    gameType: GameType,
    background: string,
    nonHeroMode: boolean
  ) => Promise<void>;
  /** Callback function to save the current mission.
   * Takes the custom name for the mission as an argument.
   */
  saveCallback: (nameCustom: string) => Promise<void>;
  /** Callback function to fetch the list of available missions. */
  listCallback: () => Promise<Mission[]>;
  /** Callback function to load a selected mission.
   * Takes the ID of the mission to load as an argument.
   */
  loadCallback: (missionId: number) => Promise<void>;
};

/**
 * MissionMenu is the main component for managing missions.
 * It provides a dropdown menu with options to create a new mission, save the current mission,
 * or load a previously saved mission. These actions are handled through various modal dialogs.
 *
 * @param props - The props for the component. See {@link MissionMenuComponentProps}.
 * @returns The MissionMenu component.
 */
export function MissionMenu({
  newCallback,
  saveCallback,
  listCallback,
  loadCallback,
}: MissionMenuComponentProps) {
  /** State for the anchor element of the dropdown menu. `null` when the menu is closed. */
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  /** State to control which modal is currently active. See {@link ModalNames}. */
  const [activeModal, setActiveModal] = React.useState<ModalNames>(
    ModalNames.CLOSED
  );
  /** State for the value entered in the "Save Mission" modal's name field. */
  const [saveModalValue, setSaveModalValue] = React.useState("");
  /** State to store the list of fetched missions for the "Load Mission" modal. */
  const [missionList, setMissionList] = React.useState<Mission[] | null>(null);
  /** State for the mission currently selected in the "Load Mission" modal's Autocomplete field. */
  const [selectedMission, setSelectedMission] = React.useState<Mission | null>(
    null
  );

  /** Boolean indicating whether the mission dropdown menu is open. */
  const open = Boolean(anchorEl);

  /**
   * Handles the click event on the "Mission" button to open the dropdown menu.
   * @param event - The mouse event from the button click.
   */
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Handles closing the mission dropdown menu.
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handles the "New Mission" menu item click. Closes the menu and opens the New Mission modal.
   */
  const handleNewMenuItem = () => {
    setAnchorEl(null);
    handleModalOpen(ModalNames.NEW);
  };

  /**
   * Handles the "Save Mission" menu item click. Closes the menu and opens the Save Mission modal.
   */
  const handleSaveMenuItem = () => {
    setAnchorEl(null);
    handleModalOpen(ModalNames.SAVE);
  };

  /**
   * Handles the "Load Mission" menu item click. Closes the menu and opens the Load Mission modal.
   */
  const handleLoadMenuItem = () => {
    setAnchorEl(null);
    handleModalOpen(ModalNames.LOAD);
  };

  /**
   * Opens a specified modal. If opening the Load Mission modal, it first fetches the list of missions.
   * @param modalName - The name of the modal to open. See {@link ModalNames}.
   */
  const handleModalOpen = React.useCallback(
    async (modalName: ModalNames) => {
      if (modalName === ModalNames.LOAD) {
        try {
          const missions = await listCallback();
          setMissionList(missions);
          // Optionally pre-select the first mission, or handle empty list
          setSelectedMission(missions.length > 0 ? missions[0] : null);
        } catch (error) {
          console.error("An error occurred while fetching missions:", error);
          setMissionList([]); // Ensure missionList is not null
        }
      }
      setActiveModal(modalName);
    },
    [listCallback]
  );

  /**
   * Closes any currently active modal.
   */
  const handleModalClose = React.useCallback(() => {
    setActiveModal(ModalNames.CLOSED);
  }, []);

  /**
   * Handles the confirmation from the "New Mission" modal.
   * Closes the current modal, shows a loading indicator, calls the `newCallback`,
   * and then closes the loading indicator.
   * @param selectedGame - The game type selected by the user.
   * @param background - The background story entered by the user.
   * @param nonHeroMode - Whether Non-Hero Mode is enabled.
   */
  const handleNewModalConfirm = React.useCallback(
    async (
      selectedGame: GameType,
      background: string,
      nonHeroMode: boolean
    ) => {
      handleModalClose();
      setActiveModal(ModalNames.LOADING);
      try {
        await newCallback(selectedGame, background, nonHeroMode);
      } catch (error) {
        console.error("An error occurred during new mission creation:", error);
      }
      setActiveModal(ModalNames.CLOSED);
    },
    [newCallback, handleModalClose]
  );

  /**
   * Handles the confirmation from the "Save Mission" modal.
   * Closes the current modal, shows a loading indicator, calls the `saveCallback`
   * with the entered mission name, and then closes the loading indicator.
   */
  const handleSaveModalConfirm = React.useCallback(async () => {
    handleModalClose();
    setActiveModal(ModalNames.LOADING);
    try {
      await saveCallback(saveModalValue);
    } catch (error) {
      console.error("An error occurred during mission save:", error);
    }
    setActiveModal(ModalNames.CLOSED);
  }, [saveCallback, saveModalValue, handleModalClose]);

  /**
   * Handles changes to the mission name input field in the "Save Mission" modal.
   * @param event - The change event from the text area.
   */
  const handleSaveModalValueChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (event.target.value !== undefined) {
      setSaveModalValue(event.target.value);
    }
  };

  /**
   * Handles the confirmation from the "Load Mission" modal.
   * Closes the current modal, shows a loading indicator, calls the `loadCallback`
   * with the selected mission's ID, and then closes the loading indicator.
   */
  const handleLoadModalConfirm = React.useCallback(async () => {
    handleModalClose();
    setActiveModal(ModalNames.LOADING);
    if (selectedMission) {
      try {
        await loadCallback(selectedMission.missionId);
      } catch (error) {
        console.error("An error occurred during mission load:", error);
      }
      setActiveModal(ModalNames.CLOSED);
    } else {
      console.warn("Load confirmed without a selected mission.");
      setActiveModal(ModalNames.CLOSED); // Still close loading if no mission selected
    }
  }, [selectedMission, loadCallback, handleModalClose]);

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
        onConfirm={(gameType, background, nonHeroMode) =>
          handleNewModalConfirm(gameType, background, nonHeroMode)
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
