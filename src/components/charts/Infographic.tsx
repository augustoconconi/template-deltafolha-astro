import React, { useEffect } from "react";
import * as pym from "pym.js";

export interface InfographicProps extends React.HTMLAttributes<HTMLElement> {
  url: string;
  autoload?: boolean;
  id: string;
  className?: string;
}

export const Infographic: React.FC<InfographicProps> = ({
  url,
  id,
  className = "",
}: InfographicProps) => {
  React.useEffect(() => {
    // Função para criar a instância do pym.Parent
    const createPymParent = () => {
      new pym.Parent(id, url, {});
    };

    // Chame a função ao montar o componente e sempre que a prop 'url' mudar
    createPymParent();

    // Dependência 'url' para reagir a mudanças
  }, [url, id]);

  return <div id={id} className={`${className}`} />;
};

export default Infographic;
