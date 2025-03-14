import {
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Grid2,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function BlogList({blogs}) {

  const navigate = useNavigate();

  
  const navigateToBlog = (blogData, index) => {
    navigate(`/blog/${index}`, {state: {blogData}})
  }
  return (
    <Grid2 container direction="column" alignItems="center" spacing={2}>
      {blogs &&
        blogs.map((blog, index) => {
          let parsedBlog = JSON.parse(blog);

          return (
            <Grid2 key={index} sx={{width: "80%"}}> {/* Added xs={12} */}
              <Card sx={{ maxWidth: "100%", textAlign: 'center', alignItems: 'center' }}>
                <CardActionArea onClick={() => navigateToBlog(parsedBlog, index)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={process.env.PUBLIC_URL + "/icon.ico"}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {parsedBlog[0].sectionHeaderText}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {parsedBlog[0].sectionSubHeaderText}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size="small" color="primary">
                    Share
                  </Button>
                </CardActions>
              </Card>
            </Grid2>
          );
        })}
    </Grid2>
  );
}

export default BlogList;
