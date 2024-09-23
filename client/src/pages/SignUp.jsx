import React from "react";
import { TextInput,Label,Button,Alert,Spinner} from "flowbite-react";
import {Link,useNavigate} from "react-router-dom";
import { useState } from "react";
import Oauth from "../components/Oauth";

export default function SignUp(){ 

  const [formData,setFormdata] = useState({});
  const [loading,setLoading] = useState(false);
  const [errorMessage,setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e)=>{
    setFormdata({...formData,[e.target.id]: e.target.value});
  }
  
  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password )
     {
      return setErrorMessage('please fill out all the fields');
     }
    try{
      setLoading(true);
      const res = await fetch("/api/auth/signup",{
        method:'POST',
        headers:{
          "content-Type":"application/json",
        },
        body:JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if(data.success === false)
      { setErrorMessage(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setErrorMessage(null);
      navigate('/sign-in');
      
  }catch(error){
   setLoading(false);
   setErrorMessage(error.message);
  }
};
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row gap-10">
        {/* left div */}
        <div className="w-full flex-col justify-center mt-[100px]">
          <Link to="/" className="font-bold dark:text-white text-4xl" >
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Ankit's
            </span>
            Blogs
          </Link>
          <p className="text-sm mt-5">This is a demo project. You can sign up with your email and password or with Google.</p>
        </div>

        {/* rightdiv */}
        <div className="w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-10">
            <div>
            <Label value="your username" />
            <TextInput  type='text'  placeholder="Username" id="username" onChange={handleChange}/>
            </div>
            <div>
            <Label value="your email" />
            <TextInput  type='text'  placeholder="Email" id="email" onChange={handleChange}/>
            </div>
            <div>
            <Label value="your password" />
            <TextInput  type='password'  placeholder="Password" id="password" onChange={handleChange}/>
            </div>
            <div className="flex flex-col gap-3 mt-4">
            <Button disabled={loading} gradientDuoTone='purpleToPink' type='submit' >
              {loading ? (
                <>
                 <Spinner size="sm"/>
                <span className="pl-3">Loading...</span>
                </>
              ): 'Sign Up'
              }
              </Button>
              <Oauth/>
            </div>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">Sign In</Link>
          </div>

         {
          errorMessage && (
            <Alert className='mt-5' color='failure'>{errorMessage}</Alert>
          )
         }

        </div>
      </div>
    </div>
  );
  }

