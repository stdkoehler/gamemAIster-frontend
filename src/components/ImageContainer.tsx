import { Box } from "@mui/material";

export default function ImageContainer({ children }: { children: string }) {
  return (
    <Box
      sx={{
        width: "100vw",
        display: "flex",
        flexDirection: "row",
        maskImage:
          "linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, transparent 100%)",
      }}
    >
      <img src={children} alt="" style={{ width: "100%", height: "auto" }} />
    </Box>
  );
}
