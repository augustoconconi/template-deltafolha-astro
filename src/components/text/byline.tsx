interface Author {
  name: string;
  profileUrl: string;
}

interface BylineProps {
  authors: Author[];
}

const Byline: React.FC<BylineProps> = ({ authors }) => {
  return (
    <div className="c-signature">
      {authors.map((author, index) => (
        <div
          key={index}
          className="c-signature__author font-bold font-serif leading-6 text-lg underline text-folha-default hover:text-folha-hover"
        >
          <a href={author.profileUrl}>{author.name}</a>
        </div>
      ))}
    </div>
  );
};

export default Byline;

// const authorsData = [
//     { name: "Augusto Conconi", profileUrl: "https://exemplo.com/augusto" },
//   ];
