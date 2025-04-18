import React from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import Typography from "@mui/material/Typography";
import { Box, useTheme } from "@mui/material";

interface MarkdownRendererProps {
  value: string;
  color: string;
}

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
                marginBottom: "8px",
                lineHeight: 1.7,
                fontSize: "0.95rem",
                letterSpacing: "0.02em",
              }}
              {...props}
            />
          ),
          hr: () => (
            <Box
              component="hr"
              sx={{
                border: "none",
                borderTop: "1px solid",
                borderColor: color,
                my: 2,
              }}
            />
          ),
        }}
      >
        {value}
      </ReactMarkdown>
    </Typography>
  );
};

export default MarkdownRenderer;
