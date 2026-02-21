import "./App.scss";
import NavBar from "./shared/components/NavBar";
import Footer from "./shared/components/Footer";
import Router from "./routes";
import { CartProvider } from "./shared/contexts/CardContext";
import { AuthProvider } from "./shared/contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app-container">
          <NavBar />
          <Router />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
