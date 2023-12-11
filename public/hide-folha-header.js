function verificarElementos() {
  const headerFolha = document.querySelector("body > header");
  const headerFolhaWrapper = document.querySelector("body > div:nth-child(31)");
  const headerFolhaWrapper2 = document.querySelector(
    "body > div:nth-child(32)"
  );
  //

  if (headerFolha && headerFolhaWrapper) {
    headerFolha.remove();
    headerFolhaWrapper.remove();
    headerFolhaWrapper2.remove();
    clearInterval(verificacao); // Para a verificação
  }
}

// Verifica a cada 1 segundo (1000ms)
const verificacao = setInterval(verificarElementos, 1000);
