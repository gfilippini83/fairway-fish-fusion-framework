
import { Button, Box, Typography, Grid2 } from '@mui/material';
import BlogSectionComponent from "../components/blogSection"
import React from 'react';
import { getRolesContains } from '../auth/authHelpers';
import { sendToApi } from '../service/backendService';
function CreateBlogPage({auth}) {

    const [componentsData, setComponentsData] = React.useState([]);
    const [componentCounter, setComponentCounter] = React.useState(1);
    const componentRefs = React.useRef([]); // Create an array of refs


  const handleAddComponent = () => {
    setComponentsData((prevData) => [
        ...prevData,
        { id: componentCounter, formData: null }, // Initialize with null formData
    ]);
    setComponentCounter(componentCounter + 1);
  };

  const handleFormData = (id, formData) => {
      setComponentsData((prevData) =>
          prevData.map((data) => (data.id === id ? { ...data, formData } : data))
      );
  };

  // All point at the function: handleFormData
  const handleSendAllFormData = () => {
    componentRefs.current.forEach((ref) => {
        if (ref && ref.handleSendFormData) {
            ref.handleSendFormData(); // Call the function
        }
    });
  };
  const handleRemoveComponent = (id) => {
    setComponentsData((prevData) => prevData.filter((data) => data.id !== id));
  };

  const uploadBlog = async () => {
    let clone = structuredClone(componentsData)
    clone.forEach( form => {
      const data = form.formData;
      // If its text, no need for image key
      if(data.contentType === "Text") {
        delete data.key
      } else {
        delete data.blogText
      }
    })
    console.log(clone)
    await sendToApi(clone)
  }

  const printBlog = async () => {
    console.log(componentsData)
  }

  if(auth.isAuthenticated && getRolesContains(["blogger", "admin"], auth.user.profile["cognito:groups"])) {
    return (
      <div>
          <Typography variant='h3'>
          Blog Builder 
          </Typography>
          {componentsData.map((data, index) => (
                <BlogSectionComponent
                    key={data.id}
                    id={data.id}
                    onFormData={handleFormData}
                    onRemove={handleRemoveComponent}
                    ref={(ref) => (componentRefs.current[index] = ref)} // Attach ref
                />
            ))}
            {/* {components.map((component) => component)} */}

          <Box pt={2} pb={2} textAlign='center'>
            <Grid2 container textAlign="center" spacing={2}>
              <Button sx={{ width: "40%" }} variant="contained" onClick={handleAddComponent}>
                Add Another Section
              </Button>
              <Button sx={{ width: "40%" }} variant="contained" onClick={printBlog}>
                Print Data
              </Button>
              <Button sx={{ width: "40%" }} variant="contained" onClick={handleSendAllFormData}>
                  Send All Form Data
              </Button>
              <Button sx={{ width: "40%" }} variant="contained" onClick={uploadBlog}>
                  Upload Blog
              </Button>
            </Grid2>
          </Box>
      </div>
    );
  } else {
    return (
      <div>Not authenticated</div>
    )
  }
}

export default CreateBlogPage;