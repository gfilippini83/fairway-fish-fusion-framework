
import './App.css';
import ResponsiveNavBar from './components/navbar';
import { Container } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AboutUsPage from './routes/aboutUs';
import BlogPage from './routes/blog';
import LandingPage from './routes/landing';
import LoggedInPage from './routes/loggedIn';
import LoggedOutPage from './routes/loggedOut';
import React from 'react';

import { useAuth } from "react-oidc-context";
import CreateBlogPage from './routes/createBlog';
import ProtectedRoute from './auth/protectedRoute';
import BlogDetails from './routes/blogDetails';


function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <Router>
    <div className="App">
      <ResponsiveNavBar auth={auth} />
      <Container sx={{backgroundColor: 'rgba(29, 34, 36, 0.5)', position: "-webkit-sticky"}} >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blog" element={<BlogPage auth={auth}/>} />
        <Route path="/create-blog" element={<ProtectedRoute element={<CreateBlogPage auth={auth} />} />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/logged-in" element={<LoggedInPage />} />
        <Route path="/logged-out" element={<LoggedOutPage />} />
        <Route path="/blog/:blogId" element={<BlogDetails />} /> {/* Route for blog details */}
      </Routes>
      </Container>
    </div>
    </Router>
  );
}




export default App;
