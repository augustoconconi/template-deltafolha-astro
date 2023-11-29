import React, { Children, cloneElement, useEffect, useState } from "react";
import Infographic from "./charts/Infographic";
import { useStore } from "@nanostores/react";
import {
  $SliderControl,
  $SliderContent,
  $SliderMarks,
  $SliderSelected,
} from "../store/slider";

interface InfographicContentProps {
  /**
   * The content to render inside the component.
   */
  children?: React.ReactNode;

  /**
   * Editoria do gráfico.
   */
  editoria: string;

  /**
   * Data de publicação do gráfico. Inserir datas no formato YYYY/MM/DD, separado por barras
   */
  data: string;

  /**
   * Slug ou retranca do gráfico.
   */
  slug: string;

  /**
   * Indica se arquivo tem múltiplos gráficos. Ao exportar artes pelo AI2HTML é possível criar várias pranchetas e exportar cada uma como um "subgráfico". Esta opção permite que todos os gráficos sejam exibidos
   */
  isMultiple: boolean;

  /**
   * The mark index.
   */
  markIndex?: number;
}

function Wrapper({ children }) {
  const arrayChildren = Children.toArray(children);

  return Children.map(arrayChildren, (child, index) => {
    return (
      <>
        <div className="h-0 translate-y-14 inset-12 max-w-5xl m-auto">
          {cloneElement(child)}
        </div>
      </>
    );
  });
}

export function InfographicContent({
  children,
  editoria,
  data,
  slug,
  isMultiple,
  markIndex,
}: InfographicContentProps) {
  const InfoIndex = !markIndex ? 1 : markIndex + 1;

  const sliderControl = useStore($SliderControl);
  const sliderContent = useStore($SliderContent);
  const sliderMarks = useStore($SliderMarks);
  const sliderSelected = useStore($SliderSelected);

  let { values, labels } = sliderContent;
  let { selected, startAt } = sliderControl;

  const [selectedOpacity, setSelectedOpacity] = useState(100);
  const [selectedOption, setSelectedOption] = useState(selected);

  const findValueFromLabel = (label) => {
    const mark = sliderMarks.find((item) => item.number === label);
    return mark?.value;
  };

  const actualSliderPosition =
    !sliderSelected && sliderSelected != 0
      ? findValueFromLabel(startAt)
      : sliderSelected;

  if (isMultiple)
    return values.map((item, index) => {
      return (
        <div
          key={index + 1}
          id={`${slug}-${index + 1}`}
          className="absolute inset-12 mt-8 w-full z-0 m-auto -translate-x-12 -translate-y-32"
          style={{
            opacity:
              findValueFromLabel(item) != actualSliderPosition ? "0" : "100",
          }}
        >
          <Infographic
            id={`${slug}-${index + 1}`}
            url={`https://arte.folha.uol.com.br/${editoria}/${data}/${slug}/infografico${
              index + 1
            }.html`}
          />
        </div>
      );
    });
  else {
    <Infographic
      id={`${slug}`}
      url={`https://arte.folha.uol.com.br/${editoria}/${data}/${slug}/`}
    />;
  }
}

export default function SliderContent({ children }) {
  return <Wrapper>{children}</Wrapper>;
}
