import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";


function Login(){

    const navigate = useNavigate();

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");


    const handleLogin = async(e)=>{

        e.preventDefault();

        try{

            const data = await loginUser({
                email,
                password
            });


            localStorage.setItem(
                "token",
                data.token
            );


            alert("Login Successful");


            navigate("/dashboard");


        }catch(error){

            alert(
                error.response.data.message
            );

        }

    }



    return(

        <div>

            <h1>
                WarehouseSync Login
            </h1>


            <form onSubmit={handleLogin}>


                <input
                type="email"
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
                    Login
                </button>


            </form>


        </div>

    )

}


export default Login;