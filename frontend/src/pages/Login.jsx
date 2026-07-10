import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Login() {
    const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
function handleLogin() {

  if (email === "" || password === "") {
    alert("Please fill all the fields!");
    return;
  }

  const user = {
    email,
    password,
  };

  console.log(user);

  alert("Login Successful!");
}

  return (
    <div className="container">

      <h1>Login</h1>

      <div className="card">

        <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
           value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button onClick={handleLogin}>
             Login
        </button>

        <br /><br />

        <Link to="/">← Back to Home</Link>

      </div>

    </div>
  );
}

export default Login;