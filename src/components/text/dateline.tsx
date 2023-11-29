interface DatelineProps {
  datetime: string;
}

const getFormattedDate = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  const day = date.getDate();
  const monthNames = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedDate = `${day}.${
    monthNames[monthIndex]
  }.${year} às ${hours}h${minutes.toString().padStart(2, "0")}`;

  return formattedDate;
};

const Dateline: React.FC<DatelineProps> = ({ datetime }) => {
  const formattedDate = getFormattedDate(datetime);

  return (
    <time
      className="c-more-options__published-date text-sm font-sans"
      itemProp="datePublished"
      dateTime={datetime}
    >
      {formattedDate}
    </time>
  );
};

export default Dateline;
