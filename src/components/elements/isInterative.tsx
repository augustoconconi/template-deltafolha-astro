type isInteractiveProps = {
  text?: string;
};

const InteractiveDisclosure: React.FC<isInteractiveProps> = ({
  text = "Este é um gráfico interativo",
  ...rest
}) => {
  return (
    <div className="my-3 flex -translate-x-1 gap-0 text-sm text-[#929292]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="33"
        height="22"
        viewBox="0 0 33 42"
        fill="none"
      >
        <path
          d="M15.25 0C18.2833 0 20.875 1.05833 23.025 3.175C25.175 5.29167 26.25 7.86667 26.25 10.9C26.25 12.6333 25.875 14.2667 25.125 15.8C24.375 17.3333 23.3167 18.6333 21.95 19.7H20.25V17.2C21.2167 16.4333 21.9583 15.5 22.475 14.4C22.9917 13.3 23.25 12.1333 23.25 10.9C23.25 8.7 22.4667 6.83333 20.9 5.3C19.3333 3.76667 17.45 3 15.25 3C13.05 3 11.1667 3.76667 9.6 5.3C8.03334 6.83333 7.25 8.7 7.25 10.9C7.25 12.1333 7.50834 13.3 8.025 14.4C8.54167 15.5 9.28334 16.4333 10.25 17.2V20.8C8.38334 19.8333 6.91667 18.4667 5.85 16.7C4.78334 14.9333 4.25 13 4.25 10.9C4.25 7.86667 5.325 5.29167 7.475 3.175C9.625 1.05833 12.2167 0 15.25 0ZM13.35 42C12.7833 42 12.25 41.8917 11.75 41.675C11.25 41.4583 10.8167 41.1667 10.45 40.8L0.150002 30.5L2.95 27.6C3.41667 27.1333 3.94167 26.775 4.525 26.525C5.10834 26.275 5.71667 26.2333 6.35 26.4L10.25 27.3V11C10.25 9.6 10.7333 8.41667 11.7 7.45C12.6667 6.48333 13.85 6 15.25 6C16.65 6 17.8333 6.48333 18.8 7.45C19.7667 8.41667 20.25 9.6 20.25 11V19.6H21.55C21.7167 19.6 21.8667 19.6333 22 19.7C22.1333 19.7667 22.2833 19.8333 22.45 19.9L29.85 23.5C30.65 23.8667 31.2417 24.4583 31.625 25.275C32.0083 26.0917 32.1167 26.9333 31.95 27.8L30.15 38.7C29.9833 39.6667 29.5167 40.4583 28.75 41.075C27.9833 41.6917 27.1167 42 26.15 42H13.35ZM12.95 39H27L29.15 26.55L20 22H17.25V11C17.25 10.4 17.0667 9.91667 16.7 9.55C16.3333 9.18333 15.85 9 15.25 9C14.65 9 14.1667 9.18333 13.8 9.55C13.4333 9.91667 13.25 10.4 13.25 11V30.95L5.55 29.3L4.4 30.45L12.95 39Z"
          fill="#929292"
        ></path>
      </svg>
      <p>{text}</p>
    </div>
  );
};

export default InteractiveDisclosure;
