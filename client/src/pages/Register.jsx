import {useState} from "react";
import {registerUser} from "../services/authService";
import {useNavigate} from "react-router-dom";


function Register(){

const navigate = useNavigate();


const [name,setName]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");



const handleRegister=async(e)=>{

e.preventDefault();


try{


await registerUser({
name,
email,
password
});


alert("Registration Successful");


navigate("/");


}
catch(error){

alert(error.response.data.message);

}


}



return(

<div>


<h1>
Create Account
</h1>


<form onSubmit={handleRegister}>


<input
placeholder="Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>


<br/>


<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>


<br/>


<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>


<br/>


<button>
Register
</button>


</form>


</div>

)

}


export default Register;