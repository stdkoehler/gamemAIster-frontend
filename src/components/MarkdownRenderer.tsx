import React from "react";
import ReactMarkdown from "react-markdown";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

interface MarkdownRendererProps {
  value: string;
  color?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ value, color = "inherit" }) => {
  return (
    <Typography color={color} component="div" sx={{ whiteSpace: "normal" }}>
      <ReactMarkdown
        components={{
          p: ({ node, ref, ...props }) => (
            <Typography
              color={color}
              component="div"
              sx={{ marginBottom: "8px"}}
              {...props}
            />
          )
        }}
      >
        {value}
      </ReactMarkdown>
    </Typography>
  );
};

export default MarkdownRenderer;