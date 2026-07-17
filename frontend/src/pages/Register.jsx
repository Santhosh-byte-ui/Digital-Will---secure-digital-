import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Register() {

  const navigate = useNavigate();

  const [formData,setFormData] = useState({
    name:"",
    email:"",
    password:""
  });

  const [loading,setLoading] = useState(false);


  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    });
  };


  const handleRegister=async()=>{

    if(!formData.name || !formData.email || !formData.password){
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

      const data=await response.json();

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

<div style={{
minHeight:"100vh",
background:"linear-gradient(135deg,#020617,#0f172a,#1e3a8a)",
display:"flex",
alignItems:"center",
justifyContent:"center",
padding:"20px",
overflowX:"hidden"
}}>


<div style={{
width:"100%",
maxWidth:"1200px",
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",
gap:"40px",
alignItems:"center"
}}>


<motion.div

initial={{opacity:0,x:-80}}
animate={{opacity:1,x:0}}
transition={{duration:.8}}

style={{color:"white",padding:"20px"}}

>

<h1 style={{
fontSize:"clamp(32px,5vw,55px)",
fontWeight:"800"
}}>
Secure Your
<br/>
Digital Legacy
</h1>


<p style={{
fontSize:"20px",
lineHeight:"1.7"
}}>
Create your account and start managing
digital assets, wills, beneficiaries and
confidential documents securely.
</p>


<div style={{
marginTop:"30px",
display:"flex",
flexDirection:"column",
gap:"15px",
fontSize:"18px"
}}>

<div>🔐 Secure Document Storage</div>
<div>📜 Digital Will Creation</div>
<div>👥 Beneficiary Management</div>
<div>🏦 Asset Tracking</div>
<div>📄 PDF Reports</div>

</div>

</motion.div>



<motion.div

initial={{opacity:0,x:80}}
animate={{opacity:1,x:0}}
transition={{duration:.8}}

style={{
background:"white",
borderRadius:"25px",
padding:"40px",
boxShadow:"0 25px 50px rgba(0,0,0,.3)"
}}

>


<h1 style={{
textAlign:"center",
color:"#001f7f"
}}>
🚀 Create Account
</h1>


<motion.input
whileFocus={{scale:1.02}}
name="name"
placeholder="Full Name"
value={formData.name}
onChange={handleChange}
style={inputStyle}
/>


<motion.input
whileFocus={{scale:1.02}}
name="email"
placeholder="Email Address"
value={formData.email}
onChange={handleChange}
style={inputStyle}
/>


<motion.input
whileFocus={{scale:1.02}}
type="password"
name="password"
placeholder="Password"
value={formData.password}
onChange={handleChange}
style={inputStyle}
/>


<motion.button

whileHover={{scale:1.05}}
whileTap={{scale:.95}}

onClick={handleRegister}

style={{
...buttonStyle,
marginTop:"10px"
}}

>

{loading ? "Creating Account..." : "🚀 Create Account"}

</motion.button>


<div style={{
textAlign:"center",
marginTop:"25px"
}}>

<p>Already have an account?</p>

<Link to="/login"
style={{
color:"#001f7f",
fontWeight:"bold",
textDecoration:"none"
}}>
Login Here
</Link>

</div>


</motion.div>


</div>

</div>

);

}


const inputStyle={
width:"100%",
padding:"15px",
marginBottom:"20px",
borderRadius:"12px",
border:"1px solid #ddd",
boxSizing:"border-box"
};


const buttonStyle={
width:"100%",
padding:"15px",
border:"none",
borderRadius:"12px",
background:"linear-gradient(135deg,#001f7f,#2563eb)",
color:"white",
fontWeight:"700",
fontSize:"16px",
cursor:"pointer"
};


export default Register;