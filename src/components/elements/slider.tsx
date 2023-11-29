import React, { useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import { useStore } from "@nanostores/react";
import {
  $SliderControl,
  $SliderContent,
  $SliderSelected,
  $SliderMarks,
} from "../../store/slider";

interface SliderWrapperProps {
  values?: number[];
  labels?: (number | string)[];
  startAt?: number | string;
  children?: React.ReactNode;
}

const SliderWrapper: React.FC<SliderWrapperProps> = ({
  values,
  labels = [], // Default labels if not provided
  startAt = !values ? null : values[0], // Default startAt if not provided
  children,
}) => {
  const sliderContent = useStore($SliderContent);
  const sliderControl = useStore($SliderControl);

  const [value, setValue] = useState(startAt || 0); // Initialize with startAt or 0
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    const min = Math.min(...values);
    const max = Math.max(...values);

    const marks = values.map((value, index) => ({
      value: value, // Use o valor original para posicionar corretamente os marks
      label: labels.length > index ? labels[index] : value,
    }));

    $SliderContent.set({
      values,
      labels,
      marks, // Updating marks here
    });
    $SliderControl.setKey("startAt", startAt);
    $SliderMarks.set(marks);
  }, [values, labels, startAt]);

  const handleSliderChange = (event, newValue) => {
    $SliderSelected.set(newValue);
    console.log(newValue);
    setValue(newValue);
    setTooltipOpen(true);
  };

  const handleSliderChangeCommitted = () => {
    setTooltipOpen(false);
  };

  return (
    <>
      <div className="m-auto w-full pl-4 pr-6">
        <Slider
          aria-label="Teste"
          value={value} // Use 'value' para tornar o Slider controlado
          marks={!sliderContent?.marks ? null : sliderContent?.marks}
          valueLabelFormat={(v) => `${v.toLocaleString("pt-BR")} km²`}
          valueLabelDisplay="on"
          onChangeCommitted={handleSliderChangeCommitted}
          onChange={handleSliderChange}
          step={100}
          min={0}
          max={14000} // Adjusted max value for better display
          sx={{
            color: "primary.main", // Altera a cor principal do Slider
            "& .MuiSlider-rail": {
              backgroundColor: "#4ca5c5", // Altera a cor da linha de trilho
            },
            "& .MuiSlider-track": {
              backgroundColor: "#0078a4", // Altera a cor da parte preenchida do Slider
            },
            "& .MuiSlider-thumb": {
              backgroundColor: "#0078a4", // Altera a cor do botão deslizante
            },
            "& .MuiSlider-valueLabel": {
              backgroundColor: "#0078a4", // Altera a cor de fundo do tooltip
              color: "white", // Altera a cor do texto do tooltip
              fontFamily: "FolhaGrafico, Arial, sans-serif",
              fontSize: "14px", // Altera o tamanho da fonte do tooltip
              visibility: tooltipOpen ? "visible" : "hidden",
              borderRadius: "3px",
            },
          }}
        />
      </div>
    </>
  );
};

export default SliderWrapper;
