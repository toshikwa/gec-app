import {
  buttonStyle,
  divStyle,
  formStyle,
  headerStyle,
  textFormStyle,
} from "./TextForm.css";
import { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import { StringDiff } from "./StringDiff";

const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

interface TextPair {
  input: string;
  output: string;
}

interface TextFormProps {}

const TextForm = ({}: TextFormProps) => {
  const [input, setInput] = useState("");
  const [textPair, setTextPair] = useState<TextPair>({ input: "", output: "" });
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
    const inputs = textPair.input.split("\n");
    const outputs = textPair.output.split("\n");
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
  }, [textPair, showRemoved]);

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
          setTextPair({ input, output: data.text });
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
    <div className={textFormStyle}>
      <div className={divStyle}>
        <div className={headerStyle}>
          <span>Input</span>
        </div>
        <div>
          <textarea
            className={formStyle}
            onChange={handleTextChange}
            value={input}
          />
        </div>
      </div>
      <div className={divStyle}>
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
        <code
          contentEditable={true}
          suppressContentEditableWarning={true}
          className={formStyle}
        >
          {diff}
        </code>
      </div>
    </div>
  );
};

export default TextForm;
