import { buttonStyle, divStyle, formStyle, headerStyle } from "./TextForm.css";
import { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import { StringDiff } from "./StringDiff";

const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

interface TextFormProps {}

const TextForm = ({}: TextFormProps) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [showRemoved, setShowRemoved] = useState(true);
  const [diff, setDiff] = useState(
    <StringDiff
      input={""}
      output={""}
      isLast={true}
      showRemoved={showRemoved}
    />
  );

  useEffect(() => {
    const inputs = input.split("\n");
    const outputs = output.split("\n");
    setDiff(
      <>
        {inputs.map((_, i) => (
          <StringDiff
            key={i}
            input={inputs[i]}
            output={outputs[i]}
            isLast={i == inputs.length}
            showRemoved={showRemoved}
          />
        ))}
      </>
    );
  }, [output, showRemoved]);

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
          setOutput(data.text);
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
          <Button
            onClick={() => setShowRemoved(!showRemoved)}
            size="xs"
            className={buttonStyle}
          >
            {showRemoved ? "Hide removed words" : "Show removed words"}
          </Button>
        </div>
      </div>
      <div className={divStyle}>
        <textarea
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
