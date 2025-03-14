import { Box, Container, ImageListItem, Typography } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';

function srcset(image) {
    return {
      src: `${image}`,
      srcSet: `${image}`,
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
            {blogData[0].contentType  === "Image/Video" &&
                <ImageListItem key={blogData[0].key} cols={ 1} rows={ 1}>
                <img
                {...srcset(blogData[0].key, 121, 2, 2)}
                alt={"Holder"}
                loading="lazy"
                />
            </ImageListItem>}
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
                            {data.contentType  === "Image/Video" &&
                                <ImageListItem key={data.key} cols={ 1} rows={ 1}>
                                <img
                                {...srcset(data.key, 121, 2, 2)}
                                alt={"Holder"}
                                loading="lazy"
                                // onClick={migrate}
                                />
                            </ImageListItem>}
                        </div>
                     )
                } else {
                    return (<div></div>)
                }
            })}
        </Box>
        <Container sx={{p:1}}>  
        </Container>
    </div>
  );
}

export default BlogDetails;