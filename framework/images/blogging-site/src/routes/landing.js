import { Box, Typography, ImageList, ImageListItem, ListItem, ListItemText, List, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getPaginatedBlogs } from '../service/backendService';
import BlogList from '../components/blogList';

// function migrate(event) {
//   window.open(event.target.currentSrc, '_blank')
// }

// function srcset(image, size, rows = 1, cols = 1) {
//   return {
//     src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
//     srcSet: `${image}?w=${size * cols}&h=${
//       size * rows
//     }&fit=crop&auto=format&dpr=2 2x`,
//   };
// }

function LandingPage() {
  
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
            const response = await getPaginatedBlogs()
            const paginated_blogs = response.data.objects
            setData(paginated_blogs);
            setLoading(false);
        } catch (e) {
            setError(e);
            setLoading(false);
        }
      };

      fetchData();
    }, []);
  
    if (error) {
      return <p>Error: {error.message}</p>;
    }

    return (
      <div>
        
        <Container sx={{p:1}}>
          
        </Container>
        <Typography variant='h3' color='rgba(255,255,255,1)' sx={{outline:2, outlineStyle: "dotted"}}>Welcome to Fairway Fish Fusion!</Typography>
        <Container sx={{p:1}}>
          
        </Container> 
        { !loading && <Container sx={{ textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h3" color='rgba(255,255,255,1)' sx={{outline:2, outlineStyle: "dotted"}} textAlign={'center'}>
              Most Recent Blogs!
            </Typography>
            <BlogList blogs={data} />
          </Container>}
        { loading && 
        <p>Loading...</p>}
        <Container sx={{p:1}}>
          
        </Container>
        </div>
    );
  }

  export default LandingPage;