type ParagraphProps = {
  children: React.ReactNode;
  className?: string;
  type?: "fonte" | "unidade" | "default" | "score" | "grafico" | "legend";
};

const Paragraph: React.FC<ParagraphProps> = ({
  children,
  className = "",
  type = "default",
  ...rest
}) => {
  const defaultStyles = "font-sans text-lg";

  switch (type) {
    case "fonte":
      return (
        <p className="font-sans text-xs leading-3" {...rest}>
          {" "}
          {children}
        </p>
      );

      break;
    case "unidade" || "legend":
      return (
        <p className="font-sans text-xs leading-3 font-medium" {...rest}>
          {children}
        </p>
      );
      break;
    case "score":
      return (
        <p className={`font-serif text-xl leading-4 font-light`} {...rest}>
          {children}
        </p>
      );
      break;
    case "grafico":
      return (
        <p className={`${defaultStyles} ${className}`} {...rest}>
          {children}
        </p>
      );
      break;
    default:
      return (
        <p className={`text-lg sm:text-xl font-serif ${className}`} {...rest}>
          {children}
        </p>
      );
      break;
  }
};

export default Paragraph;
