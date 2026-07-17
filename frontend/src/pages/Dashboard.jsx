import SecurityScore from "../components/SecurityScore";
import DeadManStatus from "../components/DeadManStatus";
import RecentActivity from "../components/RecentActivity";
import UploadTrendChart from "../components/UploadTrendChart";
import AssetPieChart from "../components/AssetPieChart";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


function Dashboard() {


const [stats,setStats] = useState({

totalAssets:0,
totalBeneficiaries:0,
totalWills:0,
totalDocuments:0,
totalEstateValue:0,

assetDistribution:[],
uploadTrend:[],
recentActivities:[],
deadManStatus:null

});



useEffect(()=>{

fetchDashboard();

},[]);



const fetchDashboard = async()=>{

try{


const token = localStorage.getItem("token");


const response = await fetch(

"https://digital-will-wg4g.onrender.com/api/dashboard",

{

headers:{

Authorization:`Bearer ${token}`

}

}

);



const data = await response.json();


if(response.ok){

setStats(data);

}



}

catch(error){

console.log(error);

}


};




const cardStyle={

background:"#ffffff",

borderRadius:"16px",

padding:"25px",

minWidth:"220px",

textAlign:"center",

boxShadow:
"0 8px 20px rgba(0,0,0,0.08)"

};




const buttonStyle={

border:"none",

padding:"12px 20px",

borderRadius:"10px",

color:"white",

cursor:"pointer",

fontWeight:"bold"

};




return (


<div

style={{

minHeight:"100vh",

background:"#f4f7fc",

padding:"30px"

}}

>



<motion.div

initial={{
opacity:0,
y:-40
}}

animate={{
opacity:1,
y:0
}}

transition={{
duration:.7
}}

style={{

background:
"linear-gradient(135deg,#001f7f,#0047ff)",

color:"white",

padding:"30px",

borderRadius:"20px",

marginBottom:"30px"

}}

>


<h1>

👋 Welcome to Digital Will Management System

</h1>


<p>

Securely manage your wills, assets,
beneficiaries and important documents.

</p>


</motion.div>





<h2

style={{

color:"#001f7f",

marginBottom:"20px"

}}

>

Dashboard Overview

</h2>





<motion.div

initial={{
opacity:0,
y:40
}}

animate={{
opacity:1,
y:0
}}

transition={{
duration:.8
}}

style={{

display:"flex",

gap:"20px",

flexWrap:"wrap",

justifyContent:"center"

}}

><motion.div

whileHover={{
scale:1.05,
y:-5
}}

style={cardStyle}
>

<h1>📜</h1>
<h2>{stats.totalWills}</h2>
<p>Total Wills</p>

</motion.div>




<motion.div

whileHover={{
scale:1.05,
y:-5
}}

style={cardStyle}
>

<h1>🏠</h1>
<h2>{stats.totalAssets}</h2>
<p>Total Assets</p>

</motion.div>




<motion.div

whileHover={{
scale:1.05,
y:-5
}}

style={cardStyle}
>

<h1>💰</h1>

<h2>
₹
{Number(
stats.totalEstateValue || 0
).toLocaleString()}

</h2>

<p>Total Estate Value</p>

</motion.div>




<motion.div

whileHover={{
scale:1.05,
y:-5
}}

style={cardStyle}
>

<h1>👨‍👩‍👧‍👦</h1>

<h2>
{stats.totalBeneficiaries}
</h2>

<p>Total Beneficiaries</p>

</motion.div>




<motion.div

whileHover={{
scale:1.05,
y:-5
}}

style={cardStyle}
>

<h1>📄</h1>

<h2>
{stats.totalDocuments}
</h2>

<p>Vault Documents</p>

</motion.div>




<motion.div

whileHover={{
scale:1.05,
y:-5
}}

style={cardStyle}
>

<h1>☁️</h1>

<h2>AWS S3</h2>

<p>Cloud Storage Active</p>

</motion.div>


</motion.div>





<AssetPieChart
data={stats.assetDistribution}
/>


<UploadTrendChart
data={stats.uploadTrend}
/>



<RecentActivity
activities={stats.recentActivities}
/>



<DeadManStatus
data={stats.deadManStatus}
/>



<SecurityScore
stats={stats}
/>





<div

style={{
marginTop:"40px"
}}

>

<h2

style={{
color:"#001f7f"
}}

>

Quick Actions

</h2>



<div

style={{

display:"flex",

gap:"15px",

flexWrap:"wrap"

}}

>


<Link to="/create-will">

<motion.button

whileHover={{
scale:1.08
}}

whileTap={{
scale:.95
}}

style={{
...buttonStyle,
background:"#001f7f"
}}

>

➕ Create Will

</motion.button>

</Link>



<Link to="/assets">

<motion.button

whileHover={{
scale:1.08
}}

whileTap={{
scale:.95
}}

style={{
...buttonStyle,
background:"#16a34a"
}}

>

🏠 Manage Assets

</motion.button>

</Link>




<Link to="/vault">

<motion.button

whileHover={{
scale:1.08
}}

whileTap={{
scale:.95
}}

style={{
...buttonStyle,
background:"#dc2626"
}}

>

📂 Digital Vault

</motion.button>

</Link>



<Link to="/my-wills">

<motion.button

whileHover={{
scale:1.08
}}

whileTap={{
scale:.95
}}

style={{
...buttonStyle,
background:"#9333ea"
}}

>

📄 My Wills

</motion.button>

</Link>


</div>

</div>






<motion.div

initial={{
opacity:0,
y:40
}}

whileInView={{
opacity:1,
y:0
}}

transition={{
duration:.7
}}

style={{

background:"#ffffff",

marginTop:"40px",

padding:"25px",

borderRadius:"16px",

boxShadow:
"0 8px 20px rgba(0,0,0,0.08)"

}}

>


<h2

style={{
color:"#001f7f"
}}

>

About Your Digital Will

</h2>


<p

style={{

color:"#555",

lineHeight:"1.8"

}}

>

This platform helps you securely store assets,
create digital wills, manage beneficiaries,
upload important documents, and ensure proper
inheritance distribution through a secure
verification process.

</p>


</motion.div>



</div>


);

}


export default Dashboard;