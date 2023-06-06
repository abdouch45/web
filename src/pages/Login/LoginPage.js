import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:80/api/login', {
        email,
        motdepasse: password
      });

      const token = response.data.token;
      const role = response.data.role;

      localStorage.setItem('token', token);
      if(response.data.role==='admin'){        
        localStorage.setItem('role', role);
        setEmail('');
      setPassword('');

      // Call the onLogin callback function to update the state in the App component
      onLogin(token, role);

      // Redirect to the orders route if credentials are correct
      navigate('/');
      }else{
        console.log('unauthorized');
      }

      
    } catch (error) {
      console.error('Error:', error);
      // Handle error cases, such as displaying an error message to the user
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={handleEmailChange} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={handlePasswordChange} name="motdepasse" />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
