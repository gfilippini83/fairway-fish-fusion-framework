import { Box, Container, ImageListItem, Typography } from '@mui/material';
import React from 'react';
import { data, useLocation } from 'react-router-dom';

function srcset(image, size, rows = 1, cols = 1) {
    return {
      src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${size * cols}&h=${
        size * rows
      }&fit=crop&auto=format&dpr=2 2x`,
    };
  }

function BlogDetails() {
  const location = useLocation();
  const blogData = location.state?.blogData; // Access blog data from state
  console.log(blogData)
  if (!blogData) {
    return <p>Blog not found or data missing</p>;
  }

  return (
    <div>     
        <Container sx={{p:1}}>  
        </Container>
        <Box sx={{bgcolor: "rgba(255, 255, 255, 0.5)", borderRadius: '16px', p: 15}}>
            <Typography variant={blogData[0].sectionHeaderType} sx={{ p: 5 }}>
                {blogData[0].sectionHeaderText}
            </Typography>
            <Typography variant={blogData[0].sectionSubHeaderType} sx={{ p: 5 }}>
                {blogData[0].sectionSubHeaderText}
            </Typography>
            {blogData[0].contentType  === "Text" &&
            <Typography variant={"p"} sx={{ p: 5 }}>
                {blogData[0].blogText}
            </Typography>}
            {blogData.map((data, index) => {
                if(index !== 0) {
                    return ( 
                        <div>
                            <Typography variant={data.sectionHeaderType} sx={{ p: 5 }}>
                                {data.sectionHeaderText}
                            </Typography>
                            <Typography variant={data.sectionSubHeaderType} sx={{ p: 5 }}>
                                {data.sectionSubHeaderText}
                            </Typography>
                            {data.contentType  === "Text" &&
                            <Typography variant={"p"} sx={{ p: 5 }}>
                                {data.blogText}
                            </Typography>}
                            {data.contentType  !== "Text" &&
                                <ImageListItem key={"https://blog-fff-image-hosting-bucket.s3.us-east-1.amazonaws.com/Screenshot+2025-02-26+233025.png"} cols={ 1} rows={ 1}>
                                <img
                                {...srcset("https://blog-fff-image-hosting-bucket.s3.us-east-1.amazonaws.com/Screenshot+2025-02-26+233025.png", 121, 2, 2)}
                                alt={"Holder"}
                                loading="lazy"
                                // onClick={migrate}
                                />
                            </ImageListItem>
                            }
                        </div>
                     )
                }
            })}
        </Box>
        <Container sx={{p:1}}>  
        </Container>
    </div>
  );
}

export default BlogDetails;