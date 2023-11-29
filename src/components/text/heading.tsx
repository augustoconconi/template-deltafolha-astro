type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  children: React.ReactNode;
  className?: string;
  type?: "headline" | "kicker" | "subhead" | "intertitle" | "graphic";
  // Outras props de estilo que desejares adicionar
};

const Heading: React.FC<HeadingProps> = ({
  as: Component = "h1",
  children,
  className = "",
  type = "graphic",
  ...rest
}) => {
  const defaultStyles = `font-serif ${
    Component === "h1"
      ? "font-extrabold text-xl leading-5 text-balance"
      : "font-semibold text-xl leading-5 text-balance"
  }`;
  switch (type) {
    case "headline":
      return (
        <Component
          className={`font-serif font-semibold text-3xl leading-8 sm:text-4xl sm:leading-[42px] text-balance  ${className}`}
          {...rest}
        >
          {children}
        </Component>
      );
      break;
    case "kicker":
      return (
        <Component
          className={`font-sans uppercase font-medium text-sm text-balance text-folha-hover  ${className}`}
          {...rest}
        >
          {children}
        </Component>
      );
      break;

    case "subhead":
      return (
        <Component
          className={`font-sans text-lg leading-5 sm:text-2xl text-[#bdbdbd] text-balance ${className}`}
          {...rest}
        >
          {children}
        </Component>
      );
      break;

    case "intertitle":
      return (
        <h3
          className={`font-sans font-bold uppercase text-lg leading-5 text-[#000] text-balance ${className}`}
          {...rest}
        >
          {children}
        </h3>
      );
      break;

    default:
      return (
        <Component className={`${defaultStyles} ${className}`} {...rest}>
          {children}
        </Component>
      );
      break;
  }
};

export default Heading;
