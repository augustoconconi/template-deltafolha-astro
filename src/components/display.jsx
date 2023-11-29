import Papa from "papaparse";
import { useStore } from "@nanostores/react";
import { $filters } from "../store/selector";
import React, { useState } from "react";

const data = await fetch(
  "https://arte.folha.uol.com.br/deltafolha/2023/buscador-novo-pac-municipios/data/pac-v3.csv"
).then((response) => response.text());

const Display = (props) => {
  const parsedData = Papa.parse(data, { header: true }).data;

  const [filterText, setFilterText] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filters = useStore($filters);
  const eixos = useStore($eixos);

  const searchParams = new URLSearchParams(document.location.search);

  const cityParam = searchParams.get("cidade");
  const ufParam = searchParams.get("uf");

  !cityParam ? null : $filters.setKey("municipio", cityParam);
  !ufParam ? null : $filters.setKey("uf", ufParam);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleEixoClick = (eixo) => {
    const eixosSelected = $eixos.get();

    handlePageChange(1);

    if (eixosSelected.includes(eixo)) {
      $eixos.set(eixosSelected.filter((selected) => selected !== eixo));
    } else {
      $eixos.set([...$eixos.get(), eixo]);
    }
  };

  const filteredData = parsedData.filter((row) => {
    if (filters.uf === "ac" && row.uf === "Nacional") {
      row.municipio = ""; // Remove a entrada "Nacional"
    }
    if (filters.municipio === "Abrangência Nacional/Estadual") {
      return (
        (!filters.uf ||
          row.uf.toUpperCase().includes(filters.uf.toUpperCase())) &&
        row.municipio.toUpperCase() === "-" &&
        ($eixos.get().length === 0 || $eixos.get().includes(row.eixo))
      );
    }
    if (filters.uf === "") {
      return (
        (!filters.uf || row.uf.toUpperCase()) &&
        row.municipio.toUpperCase() &&
        ($eixos.get().length === 0 || $eixos.get().includes(row.eixo))
      );
    } else
      return (
        (!filters.uf ||
          row.uf.toUpperCase().includes(filters.uf.toUpperCase())) &&
        row.municipio.toUpperCase().includes(filters.municipio.toUpperCase()) &&
        ($eixos.get().length === 0 || $eixos.get().includes(row.eixo))
      );
  });

  const uniqueIdObras = new Set();

  // Filtra e mantém apenas as entradas únicas com base no campo id_obra
  const uniqueFilteredData = filteredData.filter((row) => {
    if (uniqueIdObras.has(row.id_obra)) {
      return false;
    }
    uniqueIdObras.add(row.id_obra);
    return true;
  });

  const searchableData = uniqueFilteredData.filter((row) => {
    return (
      row.eixo.toUpperCase().includes(filterText.toUpperCase()) ||
      row.subeixo.toUpperCase().includes(filterText.toUpperCase()) ||
      row.uf.toUpperCase().includes(filterText.toUpperCase()) ||
      row.municipio.toUpperCase().includes(filterText.toUpperCase()) ||
      row.empreendimento.toUpperCase().includes(filterText.toUpperCase()) ||
      row.modalidade.toUpperCase().includes(filterText.toUpperCase()) ||
      row.classificacao.toUpperCase().includes(filterText.toUpperCase())
    );
  });

  const countByCategory = {};
  searchableData.forEach((row) => {
    const eixo = row.eixo;
    const category = eixo;
    countByCategory[category] = (countByCategory[category] || 0) + 1;
  });

  const sortedData = searchableData.sort((a, b) => {
    if (sortColumn && sortDirection) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    } else {
      return 0;
    }
  });

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const showPagination = totalPages > 1;
  const showPrevious = currentPage > 1;
  const showNext = currentPage < totalPages;

  return (
    <>
      <h1 className="uppercase text-2xl font-bold mt-4 h-8">
        {!filters.uf || filters.uf === "nacional"
          ? "Nacional"
          : `${
              filters.municipio === "Estadual"
                ? filters.uf
                : filters.municipio + ", " + filters.uf
            }`}
      </h1>
      <p className="uppercase mt-8 pb-2 text-sm font-medium">
        Deslize para ver todos os eixos
      </p>
      <section className="flex flex-nowrap flex-row overflow-x-auto gap-4 mb-8 grow">
        {Object.keys(countByCategory).map((category) => (
          <button
            key={category}
            onClick={() => handleEixoClick(category)}
            className={
              eixos.includes(category)
                ? "active border border-solid p-3 w-40 shrink-0 flex flex-col justify-between  bg-folha-default text-white hover:bg-gray-100 hover:text-black text-left min-h-[122px]"
                : "border border-solid p-3 w-40 shrink-0 flex flex-col justify-between hover:bg-folha-default hover:text-white text-left min-h-[122px]"
            }
          >
            <p className="font-bold">{category}</p>
            <p>{countByCategory[category].toLocaleString()}</p>
          </button>
        ))}
      </section>
      <section>
        <div className="max-w-[625px] sm:max-w-full relative overflow-x-auto">
          <input
            type="text"
            placeholder="Digite um tema, por exemplo: 'escola' ou 'rodovia' ..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="block w-full sm:w-1/4 p-4 text-sm text-gray-900 border-b-[1px] border-gray-300  focus:ring-blue-500 focus:border-blue-500 my-2 sm:mr-6"
          />
          <table className="deltatable table-auto text-left min-h-[150px]">
            <thead className="font-bold">
              <tr>
                <th
                  scope="col"
                  className="w-2/12 px-1 cursor-pointer"
                  onClick={() => handleSort("eixo")}
                >
                  EIXO{" "}
                  {sortColumn === "eixo" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  scope="col"
                  className="w-2/12 px-3 cursor-pointer"
                  onClick={() => handleSort("subeixo")}
                >
                  SUBEIXO{" "}
                  {sortColumn === "subeixo" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  scope="col"
                  className="w-1/12 px-1 cursor-pointer"
                  onClick={() => handleSort("uf")}
                >
                  UF{" "}
                  {sortColumn === "uf" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  scope="col"
                  className="w-4/12 px-1 cursor-pointer"
                  onClick={() => handleSort("municipio")}
                >
                  MUNICÍPIO{" "}
                  {sortColumn === "municipio" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  scope="col"
                  className="w-4/12 px-1 cursor-pointer"
                  onClick={() => handleSort("empreendimento")}
                >
                  EMPREENDIMENTO{" "}
                  {sortColumn === "empreendimento" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  scope="col"
                  className="w-2/12 px-1 cursor-pointer"
                  onClick={() => handleSort("modalidade")}
                >
                  MODALIDADE{" "}
                  {sortColumn === "modalidade" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer hidden"
                  onClick={() => handleSort("classificacao")}
                >
                  CLASSIFICAÇÃO{" "}
                  {sortColumn === "classificacao" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, index) => (
                <tr
                  scope="row"
                  key={index}
                  tabIndex={0}
                  className="hover:bg-gray-50 border-b border-solid border-gray-200"
                >
                  <td className="px-1 py-6">{row.eixo}</td>
                  <td className="px-3 py-6">{row.subeixo}</td>
                  <td className="px-1 py-6">{row.uf}</td>
                  <td className="px-1 py-6">{row.municipio}</td>
                  <td className="px-1 py-6">{row.empreendimento}</td>
                  <td className="px-1 py-6">{row.modalidade}</td>
                  <td className="hidden">{row.classificacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {showPagination && (
            <div className="pagination flex flex-row flex-wrap justify-center mt-3">
              <button
                className="py-2.5 px-1 sm:px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-folha-default hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-200"
                onClick={() => handlePageChange(1)}
              >
                Primeira
              </button>
              {showPrevious && (
                <button
                  className="py-2.5 px-1 sm:px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-folha-default hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-200"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Anterior
                </button>
              )}
              <div className="py-2.5 px-1 sm:px-5 mr-2 mb-2 text-sm font-medium text-gray-900 bg-white">
                <b>{currentPage}</b> de {totalPages}
              </div>

              {showNext && (
                <button
                  className="py-2.5 px-1 sm:px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-folha-default hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-200"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Próxima
                </button>
              )}
              <button
                className="py-2.5 px-1 sm:px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-folha-default hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-200"
                onClick={() => handlePageChange(totalPages)}
              >
                Última
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Display;
