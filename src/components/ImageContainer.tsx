import { Box } from "@mui/material";

interface ImageContainerProps {
  src: string;
  alt?: string;
}

export default function ImageContainer({ src, alt = "" }: ImageContainerProps) {
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
      <img src={src} alt={alt} style={{ width: "100%", height: "auto" }} />
    </Box>
  );
}
