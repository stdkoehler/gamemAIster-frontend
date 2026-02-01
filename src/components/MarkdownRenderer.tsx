import React from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";

/**
 * Props for the MarkdownRenderer component.
 */
interface MarkdownRendererProps {
  /** The Markdown string to render. */
  value: string;
  /** The color to apply to the rendered text. This should be a valid CSS color string (e.g., 'primary', '#FF0000'). */
  color: string;
}

/**
 * MarkdownRenderer is a component that takes a Markdown string and renders it as HTML.
 * It uses the `react-markdown` library for parsing and rendering.
 * - The `remarkBreaks` plugin is used to interpret line breaks in Markdown as `<br>` elements.
 * - Custom components are provided for:
 *   - `p` (paragraph): Renders as an MUI Typography component with specific styling (margin, line height, font size, letter spacing).
 *                      The `component="div"` prop is used to ensure it behaves like a block element for layout purposes.
 *   - `hr` (horizontal rule): Renders as an MUI Box component styled as a horizontal line with the specified color.
 *
 * @param props - The props for the component. See {@link MarkdownRendererProps}.
 * @returns The MarkdownRenderer component.
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  value,
  color,
}) => {
  return (
    <Typography
      color={color}
      component="div"
      sx={{
        whiteSpace: "normal",
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        components={{
          p: ({ node, ref, ...props }) => (
            <Typography
              color={color}
              component="div"
              sx={{
                marginTop: "0.5em",
                marginBottom: "1em",
                lineHeight: 1.7,
                fontSize: "1.05rem",
                letterSpacing: "0.02em",
              }}
              {...props}
            />
          ),
          hr: () => <Divider />,
        }}
      >
        {value}
      </ReactMarkdown>
    </Typography>
  );
};

export default MarkdownRenderer;
