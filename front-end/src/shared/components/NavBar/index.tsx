import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import "./styles.scss";

export default function NavBar() {
  return (
    <div className="navbar-container">
      <img className="logo" src={logo} alt="logo" />
      <nav className="nav-links">
        <Link to="/">Início</Link>
        <Link to="/produtos">Produtos</Link>
        <Link to="/carrinho">Carrinho</Link>
      </nav>
    </div>
  );
}
