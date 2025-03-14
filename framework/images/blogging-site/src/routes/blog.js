import { Button, Typography } from '@mui/material';
import React from 'react';
import { getPaginatedBlogs } from '../service/backendService';

function BlogPage() {

      async function getBlogs() {
            
            const ID_TOKEN = JSON.parse(localStorage.getItem('user')).id_token
            const response = await getPaginatedBlogs(ID_TOKEN)
      }

      return (
            <div>
                  <Typography variant='h3'>
                        Blog Page
                  </Typography>
                  
                  <Button sx={{ width: "40%" }} variant="contained" onClick={getBlogs}>
                  Get Blogs
                  </Button>
            </div>
            
      );
  }

  export default BlogPage;