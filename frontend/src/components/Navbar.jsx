import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      <h2>Digital Will</h2>

      <div className="menu">

        <Link to="/">
          <button>Home</button>
        </Link>

        <Link to="/register">
          <button>Register</button>
        </Link>

        <Link to="/login">
          <button>Login</button>
        </Link>

        <Link to="/dashboard">
          <button>Dashboard</button>
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;