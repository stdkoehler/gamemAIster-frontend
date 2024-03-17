import * as React from "react";
import { ComponentProps } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";

import Typography from "@mui/material/Typography";
import { TextField, Autocomplete, CircularProgress } from "@mui/material";
import { TextfieldStyle, ModalStyle, MenuStyle, AutocompleteStyle, Colors, AutocompletePaper } from "../styles/styles";

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

export const StyledTextField = React.memo(({ color, ...props }: StyledTextFieldProps) => {
  return <TextField {...props} color={color} sx={TextfieldStyle({ color })} />;
});


type NewMissionModalComponentProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const LoadingModal = ({open}: { open: boolean }) => (
  <Modal open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle()}>
          <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Typography sx={{margin: "0px 0px 20px 0px"}}>Generating new Mission</Typography>
            <CircularProgress />
          </Box>
        </Box>
  </Modal>
);

const NewMissionModal = ({ open, onClose, onConfirm }: NewMissionModalComponentProps) => (
  <Modal open={open} onClose={onClose}
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
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={onClose} color="warning">
              Cancel
            </Button>
            <Button onClick={onConfirm} color="primary">
              Confirm
            </Button>
          </Box>
        </Box>
  </Modal>
);

type SaveMissionModalComponentProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  value: string;
  onValueChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const SaveMissionModal = ({ open, onClose, onConfirm, value, onValueChange }: SaveMissionModalComponentProps) => (
  <Modal open={open} onClose={onClose}
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
};


const LoadMissionModal = ({ open, onClose, onConfirm }: LoadMissionModalComponentProps) => (
  <Modal open={open} onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle()}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Load Mission
          </Typography>
          <Autocomplete
            disablePortal
            PaperComponent={AutocompletePaper}
            options={[{label: "A"}, {label: "B"}]}
            sx={AutocompleteStyle}
            renderInput={(params) => <TextField {...params} label="Mission" />}
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
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





type MissionMenuComponentProps = {
  newCallback: () => Promise<void>;
  saveCallback: (nameCustom: string) => Promise<void>;
  //loadCallback: () => void;
};

export function MissionMenu({newCallback, saveCallback}:MissionMenuComponentProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [activeModal, setActiveModal] = React.useState<ModalNames>(ModalNames.CLOSED);
  const [saveModalValue, setSaveModalValue] = React.useState("");
  
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

  const handleModalOpen = React.useCallback((modalName: ModalNames) => {
    setActiveModal(modalName);
  }, []);

  const handleModalClose = React.useCallback(() => {
    setActiveModal(ModalNames.CLOSED);
  }, []);


  // New
  
  const handleNewModalConfirm = React.useCallback(async () => {
    handleModalClose();
    setActiveModal(ModalNames.LOADING)
    try {
      await newCallback();
    } catch (error) {
      console.error("An error occurred:", error);
    }
    setActiveModal(ModalNames.CLOSED);
  }, [newCallback]);

  // Save
  
  const handleSaveModalConfirm = React.useCallback(async () => {
    handleModalClose();
    setActiveModal(ModalNames.LOADING)
    try {
      await saveCallback(saveModalValue);
    } catch (error) {
      console.error("An error occurred:", error);
    }
    setActiveModal(ModalNames.CLOSED);
  }, [saveCallback]);

  const handleSaveModalValueChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (event.target.value !== undefined) {
      setSaveModalValue(event.target.value);
    }
  };

  // Load
  
  const handleLoadModalConfirm = () => {
    handleModalClose();
  };

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
      <NewMissionModal open={activeModal === ModalNames.NEW} onClose={handleModalClose} onConfirm={handleNewModalConfirm} />
      <SaveMissionModal open={activeModal === ModalNames.SAVE} onClose={handleModalClose} onConfirm={handleSaveModalConfirm} value={saveModalValue} onValueChange={handleSaveModalValueChange}/>
      <LoadMissionModal open={activeModal === ModalNames.LOAD} onClose={handleModalClose} onConfirm={handleLoadModalConfirm} />
    </div>
  );
}
