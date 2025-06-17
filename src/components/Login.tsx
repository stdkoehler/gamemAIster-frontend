import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { auth, provider, signInWithPopup } from "../auth/firebase";
import { shadowrunTheme } from "../theme";

const useFirebase = import.meta.env.VITE_USE_FIREBASE !== "false";

const Login: React.FC = () => {
  const [demoUser, setDemoUser] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!useFirebase) {
      if (!demoUser.trim()) {
        setError("Please enter a username.");
        return;
      }
      localStorage.setItem("demoUser", demoUser.trim());
      window.location.reload(); // reload to trigger auth state in app
      return;
    }
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("Login failed. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={shadowrunTheme}>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#222",
        }}
      >
        <Typography variant="h4" color="white" mb={3}>
          Welcome to gamemAIster
        </Typography>
        {/* Show user text field if not using Firebase */}
        {!useFirebase && (
          <TextField
            label="User"
            variant="outlined"
            value={demoUser}
            onChange={(e) => setDemoUser(e.target.value)}
            sx={{ mb: 2, background: "white", borderRadius: 1 }}
            autoFocus
          />
        )}
        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}
        <Button variant="contained" color="primary" onClick={handleLogin}>
          {useFirebase ? "Login with Google" : "Demo Login"}
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
