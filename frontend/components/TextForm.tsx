import { divStyle, formStyle, headerStyle } from "./TextForm.css";
import { useState, useEffect } from "react";
import { StringDiff } from "./StringDiff";

const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

interface TextFormProps {}

const TextForm = ({}: TextFormProps) => {
  const [input, setInput] = useState("");
  const [diff, setDiff] = useState(
    <StringDiff input={""} output={""} isLast={true} />
  );

  // update output text with delay
  useEffect(() => {
    const timer = setTimeout(() => {
      const requestParams = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      };
      fetch(backendApiUrl, requestParams)
        .then((res) => res.json())
        .then((data) => {
          const inputs = input.split("\n");
          const outputs = data.text.split("\n");
          setDiff(
            <>
              {inputs.map((_, i) => (
                <StringDiff
                  key={i}
                  input={inputs[i]}
                  output={outputs[i]}
                  isLast={i == inputs.length}
                />
              ))}
            </>
          );
        });
    }, 500);
    return () => clearTimeout(timer);
  }, [input]);

  // update input text
  const handleTextChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    setInput(event.target.value);
  };
  return (
    <>
      <div className={divStyle}>
        <div className={headerStyle}>
          <span>Input</span>
        </div>
        <div className={headerStyle}>
          <span>Output</span>
        </div>
      </div>
      <div className={divStyle}>
        <textarea
          wrap="soft"
          className={formStyle}
          onChange={handleTextChange}
          value={input}
        />
        <code
          contentEditable={true}
          className={formStyle}
          suppressContentEditableWarning={true}
        >
          {diff}
        </code>
      </div>
    </>
  );
};

export default TextForm;
