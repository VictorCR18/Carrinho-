import "./App.scss";
import NavBar from "./shared/components/NavBar";
import Footer from "./shared/components/Footer";
import Router from "./routes";
import { CartProvider } from "./shared/components/CardContext";

function App() {
  return (
    <CartProvider>
      <div className="app-container">
        <NavBar />
        <Router />
        <footer className="footer">
          <Footer />
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;
