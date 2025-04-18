import React from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

interface MarkdownRendererProps {
  value: string;
  color?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  value,
  color = "inherit",
}) => {
  return (
    <Typography color={color} component="div" sx={{ whiteSpace: "normal" }}>
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        components={{
          p: ({ node, ref, ...props }) => (
            <Typography
              color={color}
              component="div"
              sx={{ marginBottom: "8px" }}
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
