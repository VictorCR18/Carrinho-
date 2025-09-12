import "./App.scss";
import NavBar from "./shared/components/NavBar";
import Footer from "./shared/components/Footer";
import Router from "./routes";

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <Router />
      <footer className="footer">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
