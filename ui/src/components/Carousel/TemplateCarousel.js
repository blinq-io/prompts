import { useState } from "react";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

const TemplateCarousel = ({ data, handleSetRegex, handleSetParams }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [text, setText] = useState([]);
  const [paramText, setParamText] = useState([]);
  const maxSteps = data.length;
  const theme = useTheme();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ maxWidth: 800, flexGrow: 1 }}>
      {data.map((prompt, index) => {
        return activeStep === index ? (
          <textarea
            key={index}
            className="w-full rounded-lg border-black border bg-white mt-2 p-2  focus:bg-slate-100 focus:outline-none"
            onChange={(e) => {
              let inputText = text;
              inputText[index] = e.target.value;
              setText(inputText);
              handleSetRegex(inputText);
            }}
            defaultValue={
              !text[index]
                ? prompt.split(": ").length === 1
                  ? prompt.slice(0, -1)
                  : prompt.split(": ")[1].slice(0, -1)
                : text[index]
            }
          ></textarea>
        ) : null;
      })}

      {data.map((prompt, index) => {
        return activeStep === index ? (
          <div className="">
            <label>Parameters</label>
            <input
              key={index}
              type="text"
              className="w-full rounded-lg border-black border bg-white mt-2 p-2  focus:bg-slate-100 focus:outline-none"
              onChange={(e) => {
                let inputText = paramText;
                inputText[index] = e.target.value;
                setParamText(inputText);
                handleSetParams(inputText);
              }}
              defaultValue={paramText[index]}
            ></input>
          </div>
        ) : null;
      })}
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
    </Box>
  );
};
export default TemplateCarousel;
