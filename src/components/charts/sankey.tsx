import React, { useState } from "react";
import { ResponsiveSankey } from "@nivo/sankey";
import Slider from "@mui/material/Slider";
import { useStore } from "@nanostores/react";
import { $Massa, $Milei } from "../../store/slider";

const SankeyChart = () => {
  const [value, setValue] = useState(0);

  const Massa = useStore($Massa);
  const Milei = useStore($Milei);

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const mapValueToPercentage = (val) => {
    // Mapeia o valor do slider para a porcentagem desejada (23.39 a -23.39)
    return (val / 100) * 23.39;
  };

  const mapDiffValueToPercentage = (val) => {
    // Mapeia o valor do slider para a porcentagem desejada (23.39 a -23.39)
    if (val === 0) return 0;
    if (val < 0) return Math.abs((val / 100) * 23.39 + 23.39);
    return Math.abs((val / 100) * 23.39 - 23.39);
  };

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    setTooltipOpen(true);
  };

  const handleSliderChangeCommitted = () => {
    setTooltipOpen(false);
  };

  const sliderPercentage = mapValueToPercentage(value);
  const bullrichFirstTurn = 23.39;
  const bullrichSecondTurn = bullrichFirstTurn + sliderPercentage;

  // Lógica para determinar a conexão com base no valor do slider
  const data = {
    nodes: [
      { id: "1º turno" },

      { id: "Milei (1º turno)" },
      { id: "Massa (1º turno)" },
      { id: "Bullrich (1º turno)" },
      { id: "Milei (2º turno)" },
      { id: "Massa (2º turno)" },
    ],
    links: [
      { source: "1º turno", target: "Massa (1º turno)", value: 36 },
      { source: "1º turno", target: "Milei (1º turno)", value: 29.43 },
      {
        source: "1º turno",
        target: "Bullrich (1º turno)",
        value: bullrichFirstTurn,
      },
      {
        source: "Bullrich (1º turno)",
        target: sliderPercentage > 0 ? "Milei (2º turno)" : "Massa (2º turno)",
        value: Math.abs(sliderPercentage), // Define o valor absoluto do slider como o fluxo
      },
      {
        source: "Bullrich (1º turno)",
        target: value > 0 ? "Massa (2º turno)" : "Milei (2º turno)",
        value: Math.abs(mapDiffValueToPercentage(value)), // Define o valor absoluto do slider como o fluxo
      },
      { source: "Milei (1º turno)", target: "Milei (2º turno)", value: 29.43 },
      { source: "Massa (1º turno)", target: "Massa (2º turno)", value: 36 },
    ],
  };

  function generateText({ candidate, value }) {
    if (candidate === "Milei") {
      if (value >= 0) {
        let cv = 29.43 + mapValueToPercentage(value);
        $Milei.set(cv);
        return (
          cv.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + "%"
        );
      }
      if (value < 0) {
        let cv = 29.43 + mapDiffValueToPercentage(value);
        $Milei.set(cv);
        return (
          cv.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + "%"
        );
      }
    }
    if (candidate === "Massa") {
      if (value > 0) {
        let cv = 36 + mapDiffValueToPercentage(value);
        $Massa.set(cv);
        return (
          cv.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + "%"
        );
      }
      if (value <= 0) {
        let cv = 36 - mapValueToPercentage(value);
        $Massa.set(cv);
        return (
          cv.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + "%"
        );
      }
    }
  }

  return (
    <div>
      <div className="pl-4 pr-6 mb-6 m-auto z-50">
        <div className="flex justify-between mt-4">
          <div className="w-20 flex flex-col items-center gap-2">
            <img
              src="https://f.i.uol.com.br/fotografia/2023/10/22/16979483986534a2ee31c90_1697948398_4x3_md.jpg"
              className="h-10 w-10 rounded-full object-cover"
            ></img>
            <p className="text-sm leading-3">Sergio Massa</p>
            <p className="text-sm">
              {generateText({ candidate: "Massa", value: value })}
            </p>
          </div>
          <div className="w-20 flex flex-col items-center gap-2">
            <img
              src="https://f.i.uol.com.br/fotografia/2023/10/22/16979483366534a2b0cb566_1697948336_4x3_md.jpg"
              className="h-10 w-10 rounded-full object-cover"
            ></img>
            <p className="text-sm leading-3">Javier Milei</p>
            <p className="text-sm">
              {generateText({ candidate: "Milei", value: value })}
            </p>
          </div>
        </div>
        <Slider
          aria-label="Distribua os votos de Bullrich"
          defaultValue={0}
          value={value}
          valueLabelFormat={(v) =>
            v < 0
              ? `${Math.abs(mapValueToPercentage(v)).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}%`
              : `${mapValueToPercentage(v).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}%`
          } // Exibe apenas valores positivos no rótulo
          valueLabelDisplay="on"
          onChangeCommitted={handleSliderChangeCommitted}
          onChange={handleSliderChange}
          min={-100}
          max={100}
          sx={{
            "& .MuiSlider-valueLabel": {
              visibility: tooltipOpen ? "visible" : "hidden", // Controla a visibilidade do tooltip
            },
          }}
        />
      </div>
      <p className="text-xs mt-2 mb-5 max-w-[300px] m-auto">
        Se você arrastar o botão para a direita, está simulando a transferência
        de votos de Bullrich para Milei. Se arrastar para a esquerda, simula a
        transferência da macrista para Massa. As porcentagens mostram o que cada
        candidato obteve no 1º turno somado aos votos transferidos na simulação.
      </p>
      <div style={{ height: "500px" }}>
        <ResponsiveSankey
          data={data}
          align="justify"
          colors={{ scheme: "category10" }}
          nodeOpacity={1}
          nodeThickness={18}
          nodeInnerPadding={3}
          nodeSpacing={24}
          nodeBorderWidth={0}
          linkOpacity={0.5}
          linkHoverOpacity={0.8}
          linkHoverOthersOpacity={0.1}
          enableLinkGradient={true}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.4]] }}
        />
      </div>
    </div>
  );
};

export default SankeyChart;
