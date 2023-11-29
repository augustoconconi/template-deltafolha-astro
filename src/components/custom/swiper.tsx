import React, { Children, cloneElement, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Heading from "../text/heading";
import ArgentinaMap from "../mapa/maplibre";
import { useStore } from "@nanostores/react";
import { $latlon } from "../../store/map";
import Paragraph from "../text/paragraph";
import Dateline from "../text/dateline";
import SliderWrapper from "../elements/slider";
import InteractiveDisclosure from "../elements/isInterative";

export default function CustomMapSwiper() {
  const latlon = useStore($latlon);
  const swiperRef = useRef(null);

  const goToNextSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      console.log("here");
      swiperRef.current.swiper.slideNext();
    }
    console.log("aqui");
  };

  function geoBrowser() {
    if ("geolocation" in navigator) {
      // Geolocalização disponível
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          $latlon.setKey("lat", latitude);
          $latlon.setKey("lon", longitude);
          $latlon.setKey("error", null);
          goToNextSlide();
        },

        (error) => {
          console.error("Erro ao obter localização:", error);
          $latlon.setKey("error", error);
        }
      );
    } else {
      // Geolocalização não suportada
      console.error("Geolocalização não é suportada pelo seu navegador");
      // Ofereça uma mensagem alternativa ou uma experiência de fallback para o usuário
    }
  }

  return (
    <div className="absolute bottom-0 top-0 m-auto h-full w-full sm:max-w-full">
      <Swiper
        ref={swiperRef}
        spaceBetween={0}
        slidesPerView={1}
        direction={"horizontal"}
        modules={[Navigation, A11y]}
        effect="slide"
        cssMode={false}
        edgeSwipeThreshold={0}
        resistanceRatio={1000}
        allowTouchMove={false}
        className="absolute bottom-0 top-0 m-auto h-full w-full sm:max-w-full"
        //onSlideChange={(swiper) => $Story.set(swiper.activeIndex)}
        // onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide>
          <div className="m-auto grid h-full grid-cols-1 bg-[#202A25] sm:grid-cols-4 sm:gap-5">
            <div className="col-start-1 col-end-4 flex flex-col sm:col-end-3">
              <div className="flex flex-col items-end p-3 sm:py-3">
                <button className="max-w-fit rounded-md bg-gray-800 px-3 py-2 text-sm">
                  Pular interativo
                </button>
              </div>
              <div className="m-auto flex max-w-lg flex-col gap-3 px-5">
                <Heading as="p" type="kicker">
                  Deltafolha
                </Heading>
                <Heading as="h1" type="headline">
                  Qual o tamanho do desmatamento?
                </Heading>
                <Heading as="h2" type="subhead">
                  Você consegue estimar o desmatamento da floresta Amazônica? E
                  se o desmatamento começasse ao redor da sua casa, até onde
                  iria?
                </Heading>
                <Dateline datetime="2023-12-04 10:00:00" />
                <div className="absolute z-50 my-6 flex w-[88%] translate-y-[320px] flex-col rounded-lg bg-white text-black sm:relative sm:w-full sm:translate-y-0">
                  <div className="rounded-lg px-3 py-2 hover:bg-gray-100">
                    <input
                      className="w-full bg-transparent text-center"
                      type="text"
                      id="endereco"
                      name="endereco"
                      placeholder="Digite seu endereço ou CEP"
                      autoComplete="postal-code"
                      required
                      aria-describedby="descricao-endereco erro-endereco"
                    />
                    <span id="descricao-endereco" style={{ display: "none" }}>
                      Digite seu endereço completo ou CEP para buscar
                      informações.
                    </span>
                    <span id="erro-endereco" style={{ display: "none" }}>
                      Por favor, preencha este campo ou permita o nosso acesso à
                      sua localização.
                    </span>
                  </div>
                  <hr />
                  <button
                    className="flex w-full justify-center gap-1 rounded-lg px-3 py-2 text-center font-bold uppercase text-gray-600 hover:bg-gray-100"
                    onClick={geoBrowser}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgb(75 85 99)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="self-center"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>{" "}
                    Usar minha localização
                  </button>
                </div>
                {latlon.error && (
                  <p>
                    {latlon.error.message === "User denied Geolocation"
                      ? "Não conseguimos obter sua localização. Autorize o compartilhamento pelo navegador ou digite um endereço"
                      : `Ocorreu um erro: ${latlon.error.message}`}
                  </p>
                )}
                {latlon.lat && latlon.lon && (
                  <p>
                    Latitude: {latlon.lat}, Longitude: {latlon.lon}
                  </p>
                )}
                <Paragraph type="fonte">
                  Nenhum endereço (não limitado ao logradouro e a coordenadas
                  geográficas) é armazenado no seu dispositivo, nos servidores
                  da Folha ou de parceiros. Utilizamos Google Maps e Stadia Maps
                  como subprocessadores.
                </Paragraph>
              </div>
            </div>
            <div className="col-start-1 col-end-4 sm:col-start-3 sm:col-end-5">
              <ArgentinaMap />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="m-auto h-full bg-[#f7f7f7]">
            <div className="h-42 absolute bottom-4 z-50 mx-2 my-6 max-w-xl rounded-lg bg-white px-4 py-4 font-sans text-base text-black sm:bottom-0 sm:left-[25%] sm:mx-4 sm:px-8 sm:py-9">
              <Heading as="h2" type="graphic" className="p-2">
                Imagine que o desmatamento da Amazônia Legal acontece na sua
                vizinhança.
              </Heading>
              <p className="p-2 leading-4">
                Estime a destruição no último ano em km². E não se preocupe,
                iremos mostrar a situação atual já no próximo slide
              </p>
              <InteractiveDisclosure text="Amplie o raio deslizando o seletor abaixo" />
              <SliderWrapper
                values={[0, 7000, 14000]}
                labels={["0 km²", "7.000 km²", "14.000 km²"]}
                startAt={0}
              />
            </div>
            <ArgentinaMap />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
