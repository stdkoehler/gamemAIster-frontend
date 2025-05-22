import { Box } from "@mui/material";

/**
 * Props for the ImageContainer component.
 */
interface ImageContainerProps {
  /** The source URL of the image. */
  src: string;
  /** The alt text for the image. Defaults to an empty string. */
  alt?: string;
}

/**
 * ImageContainer is a component that displays an image with a specific styling.
 * It makes the image take the full viewport width and applies a CSS mask
 * to create a fade-out effect towards the bottom.
 *
 * @param props - The props for the component. See {@link ImageContainerProps}.
 * @returns The ImageContainer component.
 */
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
