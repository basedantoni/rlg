import React, { useState } from "react";

interface HighlightedTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const HighlightedTextarea: React.FC<HighlightedTextareaProps> = ({
  className = "",
  ...props
}) => {
  const [text, setText] = useState("");

  // Update state on input change and call any provided onChange handler.
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  // Split the text on the word "hello" and wrap it with custom styling.
  const renderHighlightedText =
    text === "hello" ? (
      <span className="mr-2 py-0.5 px-0.5 rounded-[0.25rem] bg-destructive-foreground text-red-600">
        {text}
      </span>
    ) : (
      <span>{text}</span>
    );

  return (
    <div className="relative w-full h-9">
      {/* Overlay div displaying the highlighted text */}
      <div className="absolute top-0 left-0 w-full h-full px-3 py-2 text-base whitespace-pre-wrap break-words text-black pointer-events-none">
        {renderHighlightedText}
      </div>

      {/* Native textarea for user input */}
      <textarea
        {...props}
        value={text}
        onChange={handleChange}
        className={`resize-none absolute top-0 left-0 w-full flex h-full rounded-md border border-input bg-transparent px-3 py-2 text-base caret-black placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${className}`}
      />
    </div>
  );
};

export default HighlightedTextarea;
