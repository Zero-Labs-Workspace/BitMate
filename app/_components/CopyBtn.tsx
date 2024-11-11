import { Copy } from "lucide-react";
import React, { useState } from "react";

const CopyButton = ({ text }: any) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
      })
      .catch((error) => {
        console.error("Failed to copy:", error);
      });
  };

  return (
    <button onClick={handleCopy}>
      <Copy className="w-4 hover:text-white/50" />
    </button>
  );
};

export default CopyButton;
