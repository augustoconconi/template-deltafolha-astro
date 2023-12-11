import Slider from "@mui/material/Slider";
import { useEffect, useState } from "react";

const LogSlider = () => {
  const [logValue, setLogValue] = useState(0);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const logScale = (value) => {
    // Escala logarítmica de zero a 14 mil (base 10)
    const minLog = Math.log10(1);
    const maxLog = Math.log10(14000);

    const log = minLog + (value * (maxLog - minLog)) / 100;
    return Math.pow(10, log);
  };

  const inverseLogScale = (value) => {
    // Função para escala logarítmica inversa de zero a 14 mil (base 10)
    const minLog = Math.log10(1);
    const maxLog = Math.log10(14000);

    const log = Math.log10(value);
    return ((log - minLog) * 100) / (maxLog - minLog);
  };

  useEffect(() => {
    // Mostra o valor no console
    console.log(logValue);
  }, [logValue]);

  const handleSliderChange = (event, newValue) => {
    //$SliderSelected.set(newValue);
    console.log(newValue);
    setLogValue(logScale(newValue));
    //setValue(newValue);
    setTooltipOpen(true);
  };

  const handleSliderChangeCommitted = () => {
    setTooltipOpen(false);
  };

  return (
    <Slider
      min={0}
      max={100} // Representando a escala de 0 a 100%
      step={10} // Ajuste conforme necessário
      valueLabelFormat={(v) => `${logScale(v).toLocaleString("pt-BR")} km²`}
      valueLabelDisplay="on"
      value={inverseLogScale(logValue)} // Aplica a escala logarítmica inversa
      onChangeCommitted={handleSliderChangeCommitted}
      onChange={handleSliderChange}
      aria-labelledby="log-slider"
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
  );
};

export default LogSlider;
