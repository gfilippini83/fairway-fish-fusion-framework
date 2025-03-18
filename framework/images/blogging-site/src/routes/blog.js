import { Container, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getPaginatedBlogs } from '../service/backendService';
import BlogList from '../components/blogList';

function BlogPage() {
      
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
        
          if (loading) {
            return <p>Loading...</p>;
          }
        
          if (error) {
            return <p>Error: {error.message}</p>;
          }

      return (
          <Container sx={{ textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h3" textAlign={'center'}>
              Blog Page
            </Typography>
            <BlogList blogs={data} />
          </Container>
            
      );
  }

  export default BlogPage;