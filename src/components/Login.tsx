import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { auth, provider, signInWithPopup } from "../auth/firebase";

const Login: React.FC = () => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("Login failed. Please try again.");
    }
  };

  return (
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
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login with Google
      </Button>
    </Box>
  );
};

export default Login;
