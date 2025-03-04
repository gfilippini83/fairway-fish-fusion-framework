
import './App.css';
import ResponsiveNavBar from './components/navbar';
import { Container } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AboutUsPage from './routes/aboutUs';
import BlogPage from './routes/blog';
import LandingPage from './routes/landing';
import LoggedInPage from './routes/loggedIn';
import LoggedOutPage from './routes/loggedOut';
import React, { useState, useEffect } from 'react';

import { useAuth } from "react-oidc-context";
import CreateBlogPage from './routes/createBlog';
import ProtectedRoute from './auth/protectedRoute';


function App() {
  const auth = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://dyl3fm9keg.execute-api.us-east-1.amazonaws.com/production/'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (auth.isLoading && loading) {
    return <div>Loading...</div>;
  }

  if (auth.error || error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <Router>
    <div className="App">
      <ResponsiveNavBar auth={auth} />
      <Container sx={{backgroundColor: 'rgba(29, 34, 36, 0.5)', position: "-webkit-sticky"}} >
      <Routes>
        <Route path="/" element={<LandingPage props={data}/>} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/create-blog" element={<ProtectedRoute element={<CreateBlogPage auth={auth} />} />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/logged-in" element={<LoggedInPage />} />
        <Route path="/logged-out" element={<LoggedOutPage />} />
      </Routes>
      </Container>
    </div>
    </Router>
  );
}




export default App;
