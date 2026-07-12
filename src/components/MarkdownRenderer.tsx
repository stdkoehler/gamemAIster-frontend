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
 *   - `p` (paragraph): Renders as an MUI Typography using the theme's `chatText` variant (font/size/line-height/letter-spacing
 *                      come from the active theme), plus paragraph margins set here. `component="div"` makes it behave
 *                      as a block element for layout purposes.
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
              variant="chatText"
              color={color}
              component="div"
              sx={{
                marginTop: "0.5em",
                marginBottom: "1em",
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
