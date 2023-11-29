import { CSSProperties } from "react";
import { useStore } from "@nanostores/react";
import { $filters, $seriesX, $seriesY } from "../store/selector";
import React, { useState, useEffect } from "react";
import clsx from "clsx";

import Papa from "papaparse";

import Select, { components, DropdownIndicatorProps } from "react-select";

const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};
const groupBadgeStyles: CSSProperties = {
  backgroundColor: "#EBECF0",
  borderRadius: "2em",
  color: "#172B4D",
  display: "inline-block",
  fontSize: 12,
  fontWeight: "normal",
  lineHeight: "1",
  minWidth: 1,
  padding: "0.16666666666667em 0.5em",
  textAlign: "center",
};

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    </components.DropdownIndicator>
  );
};

const ClearIndicator = (props) => {
  return (
    <components.ClearIndicator {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </components.ClearIndicator>
  );
};

const MultiValueRemove = (props) => {
  return (
    <components.MultiValueRemove {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </components.MultiValueRemove>
  );
};

const controlStyles = {
  base: "border border-solid bg-white hover:cursor-pointer mx-1",
  focus: "border-primary-600 ring-1 ring-primary-500",
  nonFocus: "border-gray-300 hover:border-gray-400",
};
const placeholderStyles = "text-gray-500 pl-1 py-0.5";
const selectInputStyles = "pl-1 py-0.5";
const valueContainerStyles = "p-1 gap-1";
const singleValueStyles = "leading-7 ml-1";
const multiValueStyles =
  "bg-gray-100 rounded items-center py-0.5 pl-2 pr-1 gap-1.5";
const multiValueLabelStyles = "leading-6 py-0.5";
const multiValueRemoveStyles =
  "border border-gray-200 bg-white hover:bg-red-50 hover:text-red-800 text-gray-500 hover:border-red-300 rounded-md";
const indicatorsContainerStyles = "p-1 gap-1";
const clearIndicatorStyles =
  "text-gray-500 p-1 rounded-md hover:bg-red-50 hover:text-red-800";
const indicatorSeparatorStyles = "bg-gray-300";
const dropdownIndicatorStyles =
  "p-1 hover:bg-folha-hover text-gray-500 rounded-md hover:text-white";
const menuStyles = "p-1 mt-2 border border-gray-200 bg-white rounded-lg";
const groupHeadingStyles = "ml-3 mt-2 mb-1 text-gray-500 text-sm";
const optionStyles = {
  base: "hover:cursor-pointer px-3 py-2 rounded",
  focus: "bg-gray-50 text-black active:bg-gray-200",
  selected: "bg-folha-default text-white",
};
const noOptionsMessageStyles =
  "text-gray-500 p-2 bg-gray-50 border border-dashed border-gray-200 rounded-sm";

const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

const handleChange = (event) => {
  const regex = /[A-Za-z]+$/;
  const ufRegex = event?.value?.match(regex);

  if (!event) {
    $filters.set([]);
  } else {
    $filters.set([...event]);
  }
};

const Selector = (props) => {
  const selectedFilters = useStore($filters);
  const seriesX = useStore($seriesX);
  const seriesY = useStore($seriesY);
  const [isClearable, setIsClearable] = useState(true);
  const [parsedData, setParsedData] = useState([]);
  const { placeholder, dataUrl } = props;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(dataUrl);
      const csvData = await response.text();
      const parsedCsvData = Papa.parse(csvData, { header: true }).data;

      setParsedData(parsedCsvData);
    };

    fetchData();
  }, [dataUrl]);

  const map = new Map();

  parsedData.forEach((row) => {
    const y = row.type;
    const x = row.country;

    if (!map.has(y)) {
      map.set(y, { label: y, options: [] });
    }

    const mapEntry = map.get(y);
    const xValue = `${x.toLowerCase()}`;

    if (!mapEntry.options.some((option) => option.value === xValue)) {
      mapEntry.options.push({
        label: !x ? "Abrangência Nacional/Estadual" : x,
        value: xValue,
      });
    }
  });

  map.forEach((mapEntry) => {
    mapEntry.options.sort((a, b) => a.label.localeCompare(b.label));
  });

  // Transforma o Map em uma matriz de valores
  const optionsList = [...map.values()];

  const filteredData = selectedFilters
    .map((obj) => {
      const countryData = parsedData.find((row) => row.country === obj.label);
      if (!countryData) {
        return null; // Retorna null se não encontrar os dados para o país
      }

      const datum = { ...countryData };
      delete datum.country;
      delete datum.type;

      for (const key in datum) {
        if (datum.hasOwnProperty(key) && datum[key] !== "") {
          datum[key] = parseFloat(datum[key].replace(",", "."));
        }
      }

      const valoresNumericos = Object.values(datum).filter(
        (value) => value !== ""
      );

      const labels = [];
      for (const ano in datum) {
        if (datum[ano] != "") {
          labels.push(ano);
        }
      }

      return {
        name: obj.label,
        type: "line",
        stack: "Total",
        data: valoresNumericos,
      };
    })
    .filter(Boolean);

  useEffect(() => {
    // Agora você pode definir $seriesX e $seriesY uma única vez após o mapeamento de filteredData.
    const labels = filteredData.flatMap((dataItem) => dataItem.labels);
    const valoresNumericos = filteredData.flatMap(
      (dataItem) => dataItem.valoresNumericos
    );
    $seriesX.set(labels);
    $seriesY.set(valoresNumericos);
  }, [filteredData]);

  console.log(filteredData);

  return (
    <Select
      options={optionsList}
      formatGroupLabel={formatGroupLabel}
      onChange={handleChange}
      placeholder={placeholder}
      isClearable={isClearable}
      isMulti
      unstyled
      styles={{
        input: (base) => ({
          ...base,
          "input:focus": {
            boxShadow: "none",
          },
        }),
        // On mobile, the label will truncate automatically, so we want to
        // override that behaviour.
        multiValueLabel: (base) => ({
          ...base,
          whiteSpace: "normal",
          overflow: "visible",
        }),
        control: (base) => ({
          ...base,
          transition: "none",
        }),
      }}
      components={{ DropdownIndicator, ClearIndicator, MultiValueRemove }}
      classNames={{
        control: ({ isFocused }) =>
          clsx(
            isFocused ? controlStyles.focus : controlStyles.nonFocus,
            controlStyles.base
          ),
        placeholder: () => placeholderStyles,
        input: () => selectInputStyles,
        valueContainer: () => valueContainerStyles,
        singleValue: () => singleValueStyles,
        multiValue: () => multiValueStyles,
        multiValueLabel: () => multiValueLabelStyles,
        multiValueRemove: () => multiValueRemoveStyles,
        indicatorsContainer: () => indicatorsContainerStyles,
        clearIndicator: () => clearIndicatorStyles,
        indicatorSeparator: () => indicatorSeparatorStyles,
        dropdownIndicator: () => dropdownIndicatorStyles,
        menu: () => menuStyles,
        groupHeading: () => groupHeadingStyles,
        option: ({ isFocused, isSelected }) =>
          clsx(
            isFocused && optionStyles.focus,
            isSelected && optionStyles.selected,
            optionStyles.base
          ),
        noOptionsMessage: () => noOptionsMessageStyles,
      }}
      {...props}
    />
  );
};

export default Selector;
