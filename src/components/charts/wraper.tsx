import React, { Children, cloneElement } from "react";
import { useStore } from "@nanostores/react";
import {
  $filters,
} from "../../store/selector";

function SliderWrapper({ values, labels, startAt, children }) {
  const sliderContent = useStore($SliderContent);
  const sliderControl = useStore($SliderControl);
  const sliderSelected = useStore($SliderSelected);

  $SliderContent.setKey("values", values);
  $SliderContent.setKey("labels", labels);
  $SliderControl.setKey("startAt", startAt);

  let min = Math.min(...values);
  let max = Math.max(...values);

  const marks = values.map((value, index) => ({
    value: ((value - min) / (max - min)) * 100,
    number: values && values.length > index ? values[index] : value,
    label: labels && labels.length > index ? labels[index] : value,
  }));

  $SliderMarks.set(marks);

  const findValueFromLabel = (label) => {
    const mark = marks.find((item) => item.label === label);
    return mark?.value;
  };

  $SliderControl.setKey("selected", findValueFromLabel(startAt));

  return (
    <div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child);
        }
        return child;
      })}
    </div>
  );
}

export default SliderWrapper;
