import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../App.css";

function Home() {
  return (
    <div className="container">

      <Navbar />

      <section className="hero">
        <h1>Secure Your Digital Legacy</h1>

        <p>
          Store your important digital assets securely and
          share them with trusted nominees when needed.
        </p>

        <div>
          <Link to="/register">
            <button>Get Started</button>
          </Link>

          <Link to="/login">
            <button>Learn More</button>
          </Link>
        </div>
      </section>


      <section className="features">

        <div className="card">
          <h3>🔒 Secure Vault</h3>
          <p>Store all your important digital assets safely.</p>
        </div>

        <div className="card">
          <h3>👨‍👩‍👧 Nominee Access</h3>
          <p>Share selected assets with trusted nominees.</p>
        </div>

        <div className="card">
          <h3>⏳ Dead Man's Switch</h3>
          <p>Automatic secure access after inactivity.</p>
        </div>

      </section>

      <Footer />

    </div>
  );
}

export default Home;