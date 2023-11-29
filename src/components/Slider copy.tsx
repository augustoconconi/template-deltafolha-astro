import Slider from "@mui/material/Slider";
import Infographic from "./charts/Infographic";
import React, { useState, useEffect, Children, cloneElement } from "react";

const SliderContent = ({ data, title, children }) => {
  const arrayChildren = Children.toArray(children);
  console.log(arrayChildren);
  const [selectedMark, setSelectedMark] = useState(5);

  let min = data[0].marker.value;
  let max = data[0].marker.value;

  data.forEach((item) => {
    const value = item.marker.value;
    if (value < min) {
      min = value;
    }
    if (value > max) {
      max = value;
    }
  });

  const marks = data.map((item) => ({
    label: item.marker.label,
    value: ((item.marker.value - min) / (max - min)) * 100,
  }));

  const valueToIndex = {};
  marks.forEach((mark, index) => {
    valueToIndex[mark.value] = index + 1;
  });

  // const marks = data.map(item => ({
  //   value: item.marker.value,
  //   label: item.marker.label
  // }));

  function valuetext(value: number) {
    return `${value}`;
  }

  function valueLabelFormat(value: number) {
    return marks.findIndex((mark) => mark.value === value) + 1;
  }

  const handleChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    setSelectedMark(valueToIndex[newValue]);
  };

  return (
    <div className="w-full px-5 m-auto max-w-5xl relative">
      <Slider
        aria-label="Restricted values"
        defaultValue={100}
        valueLabelFormat={valueLabelFormat}
        getAriaValueText={valuetext}
        step={null}
        valueLabelDisplay="off"
        marks={marks}
        onChange={handleChange}
      />
      <div className="absolute inset-12 max-w-5xl m-auto ">
        {marks.map((mark, markIndex) => (
          <div
            id={`aeroportos-movimentados-${markIndex + 1}`}
            key={markIndex + 1}
            style={{
              opacity: markIndex + 1 != selectedMark ? "0" : "100",
            }}
            className="absolute inset-12 w-full m-auto -translate-x-10"
          >
            <Infographic
              id={`aeroportos-movimentados-${markIndex + 1}`}
              url={`https://arte.folha.uol.com.br/cotidiano/2023/09/07/terra-indigena-arariboia/infografico${
                markIndex + 1
              }.html`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SubInfo = (props) => {
  const { editoria, data, slug, isMultiple, markIndex } = props;
  return (
    <Infographic
      id={`${slug}-${markIndex + 1}`}
      url={`https://arte.folha.uol.com.br/${editoria}/${data}/${slug}/infografico${
        markIndex + 1
      }.html`}
    />
  );
};

export default SliderContent;
