import React, { Children, cloneElement, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Heading from "../text/heading";
import ArgentinaMap from "../mapa/maplibre";
import { useStore } from "@nanostores/react";
import { $latlon, $imageMap } from "../../store/map";
import { $StoryPage, $StorySlidesNumber } from "../../store/stories";
import Paragraph from "../text/paragraph";
import Dateline from "../text/dateline";
import SliderWrapper from "../elements/slider";
import InteractiveDisclosure from "../elements/isInterative";
import { $SliderSelected } from "../../store/slider";

export default function CustomMapSwiper() {
  const latlon = useStore($latlon);
  const imageMap = useStore($imageMap);
  const storyPage = useStore($StoryPage);
  const slider = useStore($SliderSelected);
  const swiperRef = useRef(null);
  const swiperMiniRef = useRef(null);

  const goToNextSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goToNextSlideMini = () => {
    if (swiperMiniRef.current && swiperMiniRef.current.swiper && slider > 0) {
      swiperMiniRef.current.swiper.slideNext();
    }
  };

  const goToPreviousSlideMini = () => {
    if (swiperMiniRef.current && swiperMiniRef.current.swiper) {
      if (swiperMiniRef.current.swiper.activeIndex === 0) {
        swiperRef.current.swiper.slidePrev();
      } else swiperMiniRef.current.swiper.slidePrev();
    }
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
          //console.error("Erro ao obter localização:", error);
          $latlon.setKey("error", error);
        }
      );
    } else {
      // Geolocalização não suportada
      console.error("Geolocalização não é suportada pelo seu navegador");
      // Ofereça uma mensagem alternativa ou uma experiência de fallback para o usuário
    }
  }

  function changeSwiperPage(page) {
    $StoryPage.set(page);
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
        // onSlideChange={(s) => {
        //   const { activeIndex, snapIndex, previousIndex, realIndex } = s;
        //   changeSwiperPage(activeIndex);
        // }}
        className="absolute bottom-0 top-0 m-auto h-full w-full sm:max-w-full"
        //onSlideChange={(swiper) => $Story.set(swiper.activeIndex)}
        // onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide>
          <div className="grid h-full grid-cols-1 bg-[#202A25] sm:m-auto sm:grid-cols-4 sm:gap-5">
            <div className="col-start-1 col-end-4 flex flex-col sm:col-end-3">
              <div className="flex flex-col items-end p-3 sm:py-3">
                <a href="#article-content">
                  <button className="max-w-fit rounded-md bg-gray-800 px-3 py-2 text-sm">
                    Pular interativo
                  </button>
                </a>
              </div>
              <div className="flex max-w-lg flex-col gap-3 self-center px-5 pt-[15%]">
                <div className="flex justify-between sm:flex-row">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-36">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 556 67"
                      >
                        <path
                          d="M333.45 4c4.154 0 7.847.308 11.463 1.078v16.328h-3L338.989 9.39c-2.077-.539-3.308-.693-5.54-.693-5.077 0-7.924 2.773-7.924 6.47 0 13.092 22.004 11.86 22.004 31.345 0 10.782-7.847 19.793-20.234 19.793-5.31 0-9.54-.693-12.772-1.849V48.053h3.231l2.616 11.707c2.616 1.463 5.617 1.848 8.694 1.848 4.693 0 7.848-3.389 7.848-7.317 0-14.248-22.62-14.402-22.466-32.423C314.446 11.008 322.524 4 333.45 4zM.077 7.774v-2.85h36.16v17.79h-3l-5-13.708H18.31v24.029h7.771l1.77-7.47h3v19.561h-3l-1.77-8.01h-7.77V61.3l7.154 1.31v2.772H0v-2.773l5.693-1.31V8.853L.077 7.774zM384.998 40.66h-4.77V61.3l6.847 1.31v2.772h-25.081v-2.773l5.616-1.31V8.853l-5.54-1.078v-2.85h23.62c9.926 0 16.62 3.851 16.62 17.945 0 10.782-5.463 17.79-17.312 17.79zm-4.77-4.005h2.231c4.078 0 6.463-2.773 6.463-13.94 0-11.09-1.693-13.709-6.309-13.709h-2.385v27.649zm134.719 1.848c0-19.562 8.617-27.186 20.927-27.186 14.08 0 20.004 8.702 20.004 27.725 0 19.331-8.694 27.264-20.85 27.264-14.157 0-20.081-8.703-20.081-27.803zm-475.324.077c0-19.485 8.54-27.11 20.85-27.11 14.157 0 19.85 8.626 19.85 27.65 0 19.33-8.54 27.186-20.85 27.186-14.08 0-19.85-8.626-19.85-27.726zm137.565 26.802H163.57v-2.388l3.924-1.078L180.42 12.24h6.693l14.926 49.675 4.001 1.078v2.388h-20.62v-2.388l4.77-1.078-4.154-12.708h-11.233l-2.923 12.708 5.308 1.078v2.388zm235.046 0h-14.233v-2.388l4.385-1.078 12.926-49.675h6.847l14.926 49.675 4.463 1.078v2.388h-21.005v-2.388l4.694-1.078-4.232-12.708h-11.387l-2.846 12.708 5.462 1.078v2.388zm-297.75 0h-30.93v-2.388l4.617-1.078v-46.21l-4.385-.847v-2.464h20.388v2.464l-4.77.847v46.056h8.31l4.385-12.4h2.385v16.02zm3.154-50.523v-2.464h19.389v2.464l-3.847.847v21.642h11.694V15.706l-3.616-.847v-2.464h18.927v2.464l-4 .847v46.21l4.385 1.078v2.388h-19.312v-2.388l3.616-1.078V40.968H133.18v20.948l3.847 1.078v2.388h-19.389v-2.388l4.386-1.078V15.86l-4.386-1zm142.259 24.876c0 18.638-8.694 25.647-19.235 25.647h-20.62v-2.388l4.156-1.078v-46.21l-4.155-.847v-2.464h19.542c13.157 0 20.312 6.315 20.312 27.34zm19.465 22.027h10.079l4.232-11.784h2.692v15.404h-33.237v-2.388l4.924-1.078v-46.21l-4.847-.847v-2.464h31.468V27.72h-2.616l-4.309-11.86h-8.386V37.04h6.617l1.77-6.547h2.384v17.252h-2.385l-1.77-7.085h-6.616v21.102zm160.031-46.903v-2.464h20.312v2.464l-4.693.847v37.43c0 6.932 1.692 10.166 6.693 10.166 6.848 0 9.002-4.082 9.002-11.706v-35.89l-4.54-.847v-2.464h12.234v2.464l-4.155.847v36.66c0 10.32-5.078 14.71-15.464 14.633-11.926-.077-15.08-4.698-15.08-17.02V15.705l-4.309-.847zM512.1 65.382h-30.468v-2.388l4.617-1.078v-46.21l-4.309-.847v-2.464h20.312v2.464l-4.693.847v46.056h7.616l4.386-12.4h2.539v16.02zm31.698-26.186c0-21.487-3.693-24.799-8.001-24.799-4.309 0-8.694 2.85-8.694 24.03 0 21.41 3.693 24.875 8.078 24.875 4.309 0 8.617-3.08 8.617-24.106zm-475.4.077c0-21.487-3.77-24.722-8.155-24.722-4.463 0-8.771 2.773-8.771 23.952 0 21.41 3.846 24.8 8.232 24.8 4.308 0 8.694-2.927 8.694-24.03zm167.648 22.489h3.308c6.232 0 9.156-3.389 9.156-22.72 0-19.716-3.385-23.182-9.386-23.182h-3.078v45.902zm-56.165-33.117L175.65 45.59h9.386l-5.155-16.944zm234.97 0l-4.156 16.944h9.233l-5.078-16.944zM353.145 54.83c2.846 0 5.232 2.542 5.232 5.7 0 3.234-2.54 5.776-5.386 5.776-2.693 0-5.232-2.542-5.232-5.776 0-3.158 2.693-5.7 5.386-5.7z"
                          fill="#ffffff"
                        ></path>
                      </svg>
                    </div>
                    <div className="w-10">
                      <svg
                        xmlns="https://www.w3.org/2000/svg"
                        viewBox="0 0 55 14"
                        version="1.1"
                      >
                        <polygon
                          points="22.866795,14.321192 24.633205,8.8599664 20,5.4902743 25.733591,5.4902743 27.5,8.8817842e-16 29.266409,5.4902743 35,5.4902743 30.366795,8.8599664 32.133205,14.321192 27.5,10.92245"
                          fill="#00adef"
                        ></polygon>
                        <polygon
                          points="2.8667954,14.321192 4.6332046,8.8599664 0,5.4902743 5.7335907,5.4902743 7.5,8.8817842e-16 9.2664093,5.4902743 15,5.4902743 10.366795,8.8599664 12.133205,14.321192 7.5,10.92245"
                          fill="#d0011b"
                        ></polygon>
                        <polygon
                          points="42.866795,14.321192 44.633205,8.8599664 40,5.4902743 45.733591,5.4902743 47.5,8.8817842e-16 49.266409,5.4902743 55,5.4902743 50.366795,8.8599664 52.133205,14.321192 47.5,10.92245"
                          fill="#ffffff"
                        ></polygon>
                      </svg>
                    </div>
                  </div>
                </div>
                {/* <Heading as="p" type="kicker">
                  Deltafolha
                </Heading> */}
                <Heading as="h1" type="headline">
                  Qual o tamanho do desmatamento na Amazônia?
                </Heading>
                <Heading as="h2" type="subhead">
                  A Amazônia Legal perdeu 83.000 km² desde 2015, ano do Acordo
                  de Paris contra a crise climática. E se essa devastação fosse
                  na sua cidade, em volta da sua casa? Até onde você acha que
                  iria o desmatamento?
                </Heading>
                <Dateline datetime="2023-12-11 10:00:00" />
                <div className="absolute z-50 my-6 flex w-[88%] translate-y-[322px] flex-col rounded-lg bg-white text-black sm:relative sm:w-full sm:translate-y-0">
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
                {/* {latlon.lat && latlon.lon && (
                  <p>
                    Latitude: {latlon.lat}, Longitude: {latlon.lon}
                  </p>
                )} */}
                <Paragraph type="fonte">
                  Nenhum dado com geolocalização é armazenado no seu
                  dispositivo, nos servidores da Folha ou de parceiros.
                  Utilizamos Google Maps e Stadia Maps como subprocessadores.
                </Paragraph>
              </div>
            </div>
            <div className="col-start-1 col-end-4 min-h-[150px] sm:col-start-3 sm:col-end-5">
              <ArgentinaMap />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="m-auto h-full bg-transparent">
            <div className="h-42 absolute bottom-4 z-50 my-6 max-w-sm translate-x-1 rounded-lg bg-white px-2 py-4 font-sans text-base text-black shadow-lg sm:bottom-0 sm:left-[25%] sm:mx-4 sm:max-w-xl sm:px-8 sm:py-9">
              <div className="absolute right-0 -translate-x-2 -translate-y-10 sm:-translate-y-14">
                <button
                  onClick={goToNextSlideMini}
                  className={`${
                    slider > 0 ? "vivo" : null
                  } rounded-full bg-white p-3 drop-shadow-md hover:bg-gray-200`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-8 w-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
              <div className="absolute right-0 -translate-x-16 -translate-y-8 sm:-translate-y-12">
                <button
                  onClick={goToPreviousSlideMini}
                  className="rounded-full bg-white p-2 drop-shadow-md hover:bg-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
              </div>
              <Swiper
                ref={swiperMiniRef}
                spaceBetween={10}
                slidesPerView={1}
                direction={"horizontal"}
                modules={[Navigation, A11y]}
                effect="fade"
                cssMode={false}
                edgeSwipeThreshold={0}
                resistanceRatio={1000}
                allowTouchMove={false}
                onSlideChange={(s) => {
                  const { activeIndex, snapIndex, previousIndex, realIndex } =
                    s;
                  changeSwiperPage(activeIndex);
                }}
                className="absolute bottom-0 top-0 m-auto h-full w-full sm:max-w-full"
                //onSlideChange={(swiper) => $Story.set(swiper.activeIndex)}
                // onSwiper={(swiper) => console.log(swiper)}
              >
                <SwiperSlide>
                  <Heading as="h2" type="graphic" className="p-2">
                    Imagine que o desmatamento da Amazônia Legal acontece na sua
                    vizinhança.
                  </Heading>
                  <p className="p-2 leading-4">
                    Estime a{" "}
                    <span className="inline-block rounded-md bg-slate-200 px-2 py-1">
                      destruição no último ano
                    </span>{" "}
                    arrastando o círculo abaixo. E não se preocupe, iremos
                    mostrar a situação atual já no próximo slide
                  </p>
                  <InteractiveDisclosure text="Amplie o raio deslizando o seletor abaixo" />
                  <div className="px-3">
                    <SliderWrapper
                      values={[0, 7000, 14000]}
                      labels={["0 km²", "7.000 km²", "14.000 km²"]}
                      startAt={0}
                    />
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <Heading as="h2" type="graphic" className="p-2">
                    {slider < 9001
                      ? "O desmatamento é maior do que parece"
                      : "Você superestimou o desmatamento do último ano"}
                  </Heading>
                  <a
                    href={imageMap.binary}
                    download={`${imageMap.filename}.${imageMap.format}`}
                  >
                    Baixar
                  </a>
                  {slider < 9001 ? (
                    <p className="p-2 leading-5">
                      Você estimou que{" "}
                      <span className="inline-block rounded-md bg-slate-200 px-2 py-1">
                        {slider.toLocaleString("pt-BR", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}{" "}
                        km²
                      </span>{" "}
                      foram desmatados em 2022. Este número é aproximadamente{" "}
                      <strong>
                        {(9001 / slider).toLocaleString("pt-BR", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                        x menor
                      </strong>{" "}
                      que os{" "}
                      <span className="inline-block rounded-md bg-green-600 px-2 py-1 text-white">
                        {(9001).toLocaleString("pt-BR", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}{" "}
                        km²
                      </span>{" "}
                      destruídos.
                    </p>
                  ) : (
                    <p className="p-2 leading-5">
                      Você estimou que{" "}
                      <span className="inline-block rounded-md bg-slate-200 px-2 py-1">
                        {slider.toLocaleString("pt-BR", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}{" "}
                        km²
                      </span>{" "}
                      foram desmatados em 2023. Este número é aproximadamente{" "}
                      <strong>
                        {(slider / 9001).toLocaleString("pt-BR", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 1,
                        })}
                        x maior
                      </strong>{" "}
                      que os{" "}
                      <span className="inline-block rounded-md bg-green-600 px-2 py-1 text-white">
                        {(9001).toLocaleString("pt-BR", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}{" "}
                        km²
                      </span>{" "}
                      destruídos.
                    </p>
                  )}

                  {slider < 9001 ? (
                    <p className="p-2 leading-5">
                      Mas você não está sozinho...
                    </p>
                  ) : (
                    <p className="p-2 leading-5">
                      O valor que você escolheu equivale quase ao total
                      desmatado apenas em 2021, maior recorde em quase uma
                      década, com{" "}
                      {(13038).toLocaleString("pt-BR", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}{" "}
                      km²
                    </p>
                  )}
                </SwiperSlide>
                <SwiperSlide>
                  <Heading as="h2" type="graphic" className="p-2">
                    E desde o Acordo de Paris?
                  </Heading>
                  <p className="p-2 leading-5">
                    Em 2015, o Brasil assinou o tratado, comprometendo-se a
                    colaborar com a desaceleração da clise climática.
                  </p>
                  <p className="p-2 leading-5">
                    Desde então, o Brasil teve{" "}
                    <span className="inline-block rounded-md bg-red-500 px-2 py-1 text-white">
                      {(83196).toLocaleString("pt-BR", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}{" "}
                      km²
                    </span>{" "}
                    destruidos apenas na região da Amazônia Legal.
                  </p>
                </SwiperSlide>
              </Swiper>
            </div>
            <ArgentinaMap />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
