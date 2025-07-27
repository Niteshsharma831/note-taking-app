import React, { useState } from 'react';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Home from './Home';

const Welcome: React.FC = () => {
  const [token, setToken] = useState('');

  return (
    <div>
      {!token ? (
        <>
          <Signup />
          <Login onLogin={setToken} />
        </>
      ) : (
        <Home />
      )}
    </div>
  );
};

export default Welcome;