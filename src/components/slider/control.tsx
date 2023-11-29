import Slider from "@mui/material/Slider";
import React, { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import {
  $SliderControl,
  $SliderContent,
  $SliderSelected,
} from "../../store/slider";

interface SliderControlProps {
  data?: any[];
  labels?: (number | string)[];
  startAt?: number | string;
  values: number[];
}

const SliderControl = () => {
  const sliderControl = useStore($SliderControl);
  const sliderContent = useStore($SliderContent);
  const sliderSelected = useStore($SliderSelected);

  const { values, labels } = sliderContent;
  const { startAt } = sliderControl;

  let min = Math.min(...values);
  let max = Math.max(...values);

  const marks = values.map((value, index) => ({
    value: ((value - min) / (max - min)) * 100,
    number: values && values.length > index ? values[index] : value,
    label: labels && labels.length > index ? labels[index] : value,
  }));

  const valueToIndex: { [key: string]: number } = {};
  marks.forEach((mark, index) => {
    valueToIndex[mark.value.toFixed(2)] = index + 1;
  });

  function valuetext(value: number | string) {
    return `${value}`;
  }

  function valueLabelFormat(value: number | string) {
    return marks.find((mark) => mark.label === value);
  }
  const handleChange = (
    event: Event,
    newValue: number | any,
    activeThumb: number
  ) => {
    $SliderSelected.set(newValue);
  };

  const findValueFromLabel = (label) => {
    const mark = marks.find((item) => item.number === label);
    return mark.value;
  };

  return (
    <div className="pl-4 pr-6 mb-6 m-auto">
      <Slider
        aria-label="Restricted values"
        defaultValue={!startAt ? 100 : findValueFromLabel(startAt)}
        valueLabelFormat={valueLabelFormat}
        getAriaValueText={valuetext}
        step={null}
        valueLabelDisplay="off"
        marks={marks}
        onChange={handleChange}
      />
    </div>
  );
};

export default SliderControl;
