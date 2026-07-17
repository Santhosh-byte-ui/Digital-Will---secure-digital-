import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [formData,setFormData] = useState({
    name:"",
    email:"",
    password:""
  });

  const [loading,setLoading] = useState(false);



  const handleChange = (e)=>{

    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    });

  };



  const handleRegister = async()=>{

    if(
      !formData.name ||
      !formData.email ||
      !formData.password
    ){

      alert("Please fill all fields");
      return;

    }


    try{

      setLoading(true);


      const response = await fetch(
        "https://digital-will-wg4g.onrender.com/api/auth/register",
        {
          method:"POST",

          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify(formData)
        }
      );


      const data = await response.json();


      alert(data.message);


      if(response.ok){

        navigate("/login");

      }


    }
    catch(error){

      console.log(error);

      alert("Registration Failed");

    }
    finally{

      setLoading(false);

    }

  };



return (

<div

style={{

minHeight:"100vh",

background:
"linear-gradient(135deg,#020617,#0f172a,#1e3a8a)",

display:"flex",

justifyContent:"center",

alignItems:"center",

padding:"20px",

boxSizing:"border-box",

overflowX:"hidden"

}}

>


<div

style={{

width:"100%",

maxWidth:"1200px",

display:"grid",

gridTemplateColumns:
"repeat(auto-fit,minmax(320px,1fr))",

gap:"40px",

alignItems:"center"

}}

>



{/* LEFT SECTION */}


<div

style={{

color:"white",

padding:"20px"

}}

>


<h1

style={{

fontSize:"clamp(32px,5vw,55px)",

fontWeight:"800",

lineHeight:"1.2"

}}

>

Secure Your

<br/>

Digital Legacy

</h1>



<p

style={{

fontSize:"20px",

lineHeight:"1.7",

opacity:"0.85"

}}

>

Create your account and start managing
digital assets, wills, beneficiaries and
confidential documents through a secure
inheritance management platform.

</p>



<div

style={{

marginTop:"35px",

display:"flex",

flexDirection:"column",

gap:"18px",

fontSize:"18px"

}}

>


<div>🔐 Secure Document Storage</div>

<div>📜 Digital Will Creation</div>

<div>👥 Beneficiary Management</div>

<div>🏦 Asset Portfolio Tracking</div>

<div>📄 Professional PDF Reports</div>

<div>✔ Verified Distribution Workflow</div>


</div>


</div>
{/* RIGHT REGISTER CARD */}

<div

style={{

background:"rgba(255,255,255,0.96)",

borderRadius:"25px",

padding:"40px",

boxShadow:
"0 25px 50px rgba(0,0,0,0.3)",

width:"100%",

boxSizing:"border-box"

}}

>


<div

style={{

textAlign:"center",

marginBottom:"30px"

}}

>


<h1

style={{

color:"#001f7f",

fontSize:"36px",

marginBottom:"10px"

}}

>

🚀 Create Account

</h1>



<p

style={{

color:"#666",

fontSize:"16px"

}}

>

Join the Digital Will Management Platform

</p>


</div>




<input

type="text"

name="name"

placeholder="Full Name"

value={formData.name}

onChange={handleChange}

style={{

width:"100%",

padding:"15px",

borderRadius:"12px",

border:"1px solid #ddd",

marginBottom:"20px",

fontSize:"15px",

boxSizing:"border-box"

}}

/>



<input

type="email"

name="email"

placeholder="Email Address"

value={formData.email}

onChange={handleChange}

style={{

width:"100%",

padding:"15px",

borderRadius:"12px",

border:"1px solid #ddd",

marginBottom:"20px",

fontSize:"15px",

boxSizing:"border-box"

}}

/>



<input

type="password"

name="password"

placeholder="Password"

value={formData.password}

onChange={handleChange}

style={{

width:"100%",

padding:"15px",

borderRadius:"12px",

border:"1px solid #ddd",

fontSize:"15px",

boxSizing:"border-box"

}}

/>



<button

onClick={handleRegister}

disabled={loading}

style={{

width:"100%",

marginTop:"25px",

padding:"15px",

borderRadius:"12px",

border:"none",

background:
"linear-gradient(135deg,#001f7f,#2563eb)",

color:"white",

fontSize:"17px",

fontWeight:"700",

cursor:"pointer"

}}

>

{

loading

?

"Creating Account..."

:

"🚀 Create Account"

}


</button>




<div

style={{

textAlign:"center",

marginTop:"25px"

}}

>


<p

style={{

color:"#555"

}}

>

Already have an account?

</p>



<Link

to="/login"

style={{

color:"#001f7f",

fontWeight:"700",

textDecoration:"none"

}}

>

Login Here

</Link>


</div>




<div

style={{

textAlign:"center",

marginTop:"20px"

}}

>


<Link

to="/"

style={{

color:"#666",

textDecoration:"none"

}}

>

← Back to Home

</Link>


</div>


</div>


</div>


</div>


);

}


export default Register;