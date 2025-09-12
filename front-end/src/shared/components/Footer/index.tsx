import "./styles.scss";

export default function Footer () {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <p>© {anoAtual} - Todos os direitos reservados</p>
    </footer>
  );
};

