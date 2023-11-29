
import './App.css';
import { jwtDecode } from "jwt-decode";
import Cookies from 'universal-cookie';
import { useState } from 'react';


function App() {

  const cookies = new Cookies();
  
  const[user, setUser] = useState(null);
  const[formData, setFormData] = useState({
    username:'',
    password:''
  })
  const handleSubmit = (event) => {
        
    event.preventDefault()
    
    console.log()
    //process.env.REACT_APP_API_URL'

    fetch(process.env.REACT_APP_API_URL, {
      method: 'POST',
      body: JSON.stringify(formData),        
      headers: {
         'Content-type': 'application/json; charset=UTF-8',
      },
   })
      .then((res) => res.json())   
      .then((user) => {
        const decoded = jwtDecode(user.data);       
        setUser(decoded);
        cookies.set('jwt_authorization', user.data, {
          expires: new Date(decoded.exp * 1000), 
        });
      })      
      .catch((err) => {
         console.log(err.message);
      });


}

  const handleChange = (event) => {
    const { name, value, type } = event.target
    
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })  
      
    console.log(formData)
  }
  const logout = () => {
      
      setUser(null)
      cookies.remove('jwt_authorization')
  };
 
  
  return (
    <div className="App">   
     
      {
        user ? 
        (
          
          <div>
            <h3>Welcome {user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1)}</h3>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <div>           
            <form className="form" onSubmit={handleSubmit}>
            <h2>Login Form</h2>
            <div className="form__section-left">
            <label>
            username
            <input type="text" name="username" onChange={handleChange} value={formData.username} required />
            </label>
            <label>
            password
            <input type="password" name="password" onChange={handleChange} value={formData.password}/>
            </label>

            </div>


            <input type="submit" value="Submit!" />
            </form>
           
          </div>
        )
      
      }

    </div>
  );
}

export default App;
