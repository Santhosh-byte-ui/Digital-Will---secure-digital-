import { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Register() {
    const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
function handleRegister() {

  if (name === "" || email === "" || password === "") {
    alert("Please fill all the fields!");
    return;
  }

  const user = {
  name,
  email,
  password,
};

console.log(user);

  alert("Registration Successful!");
  setName("");
  setEmail("");
  setPassword("");
}
  return (
    <div className="container">

      <h1>Create Your Digital Will Account</h1>

      <div className="card">

        <input
           type="text"
           placeholder="Full Name"
           value={name}
           onChange={(e) => setName(e.target.value)}
          
        />

        <br /><br />

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

        <button onClick={handleRegister}>
            Create Account
         </button>

        <br /><br />

        <Link to="/">← Back to Home</Link>

      </div>

    </div>
  );
}

export default Register;