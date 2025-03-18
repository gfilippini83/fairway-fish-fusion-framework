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

  
  const navigateToBlog = (blogData, blogId) => {
    navigate(`/blog/${blogId.split("/")[1]}`, {state: {blogData}})
  }
  return (
    <Grid2 container direction="column" alignItems="center" spacing={2}>
      {blogs &&
        blogs.map((blog, index) => {
          let blogContent = JSON.parse(blog).content;
          let blogId = JSON.parse(blog).blogId;

          return (
            <Grid2 key={index} sx={{width: "80%"}}>
              <Card sx={{ maxWidth: "100%", textAlign: 'center', alignItems: 'center' }}>
                <CardActionArea onClick={() => navigateToBlog(blogContent, blogId)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={process.env.PUBLIC_URL + "/icon.ico"}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {blogContent[0].sectionHeaderText}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {blogContent[0].sectionSubHeaderText}
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
