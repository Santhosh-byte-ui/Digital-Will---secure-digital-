import { useState } from "react";

function Profile() {

  const [editing,setEditing] = useState(false);

  const [user,setUser] = useState({

    name:"Digital User",
    email:"user@example.com",
    mobile:"",
    emergencyName:"",
    emergencyMobile:""

  });


  const handleChange=(e)=>{

    setUser({

      ...user,

      [e.target.name]:e.target.value

    });

  };


  return (

    <div

    style={{

      minHeight:"100vh",

      background:"#f8fafc",

      padding:"40px"

    }}

    >


      <div

      style={{

        maxWidth:"700px",

        margin:"auto",

        background:"white",

        borderRadius:"20px",

        padding:"35px",

        boxShadow:
        "0 15px 35px rgba(0,0,0,0.1)"

      }}

      >


        <h1

        style={{

          textAlign:"center",

          color:"#001f7f"

        }}

        >

        👤 My Profile

        </h1>


        <p

        style={{

          textAlign:"center",

          color:"#666"

        }}

        >

        Manage your personal information

        </p>



        <hr/>




        <label>Name</label>

        <input

        name="name"

        value={user.name}

        disabled={!editing}

        onChange={handleChange}

        style={inputStyle}

        />



        <label>Email</label>

        <input

        value={user.email}

        disabled

        style={inputStyle}

        />



        <label>Mobile Number</label>

        <input

        name="mobile"

        value={user.mobile}

        disabled={!editing}

        onChange={handleChange}

        style={inputStyle}

        />



        <h3

        style={{

          marginTop:"30px",

          color:"#001f7f"

        }}

        >

        🚨 Emergency Contact

        </h3>



        <label>Contact Name</label>

        <input

        name="emergencyName"

        value={user.emergencyName}

        disabled={!editing}

        onChange={handleChange}

        style={inputStyle}

        />



        <label>Contact Mobile</label>

        <input

        name="emergencyMobile"

        value={user.emergencyMobile}

        disabled={!editing}

        onChange={handleChange}

        style={inputStyle}

        />



        <button

        onClick={()=>setEditing(!editing)}

        style={buttonStyle}

        >

        {editing ? "💾 Save Profile" : "✏️ Edit Profile"}

        </button>



      </div>


    </div>

  );

}



const inputStyle={

width:"100%",

padding:"14px",

marginTop:"8px",

marginBottom:"20px",

borderRadius:"10px",

border:"1px solid #ddd",

boxSizing:"border-box"

};



const buttonStyle={

width:"100%",

padding:"15px",

border:"none",

borderRadius:"12px",

background:
"linear-gradient(135deg,#001f7f,#2563eb)",

color:"white",

fontSize:"16px",

fontWeight:"700",

cursor:"pointer"

};



export default Profile;