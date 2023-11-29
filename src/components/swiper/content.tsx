import React, { Children, cloneElement, useEffect, useState } from "react";
import { useStore } from "@nanostores/react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

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
    return cloneElement(child);
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
  return <></>;
}

export default function SwiperContent({ children }) {
  return <Wrapper>{children}</Wrapper>;
}
