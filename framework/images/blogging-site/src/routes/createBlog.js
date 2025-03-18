
import { Button, Box, Typography, Grid2 } from '@mui/material';
import BlogSectionComponent from "../components/blogSection"
import React from 'react';
import { getRolesContains } from '../auth/authHelpers';
import { sendToApi } from '../service/backendService';

function CreateBlogPage({auth}) {

    const [componentsData, setComponentsData] = React.useState([]);
    const [componentCounter, setComponentCounter] = React.useState(1);
    const [uploaded, setUploaded] = React.useState(false);
    const componentRefs = React.useRef([]); // Create an array of refs

    const [allFormDataUpdated, setAllFormDataUpdated] = React.useState(false);

    React.useEffect(() => {
        if (allFormDataUpdated) {
            console.log(componentsData);

            let sections = [];
            componentsData.forEach((form) => {
                const data = form.formData;
                let object = {
                  contentType: data.contentType
                }
                // If its text, no need for image key
                if(data.contentType ==="Image") {
                  object["key"] = data.key
                } else if (data.contentType === "YouTube Link") {
                  object["youTubeLink"] = data.youTubeLink
                }else if(data.contentType === "Twitter ID") {
                  object["twitterId"] = data.twitterId
                } else {
                  object["blogText"] = data.blogText
                }
          
                if (data.sectionHeaderType !== "None") {
                  object["sectionHeaderType"] = data.sectionHeaderType
                  object["sectionHeaderText"] = data.sectionHeaderText
                }
          
                if (data.sectionSubHeaderType !== "None") {
                  object["sectionSubHeaderType"] = data.sectionSubHeaderType
                  object["sectionSubHeaderText"] = data.sectionSubHeaderText
                }
                
                sections.push(object)
            });

            const ID_TOKEN = JSON.parse(localStorage.getItem('user')).id_token;
            console.log(sections);
            sendToApi(sections, ID_TOKEN).then(res => {
              if(res) {
                console.log(res)
              }
            }).finally(
              setUploaded(true)
            )
            setAllFormDataUpdated(false);
        }
    }, [allFormDataUpdated, componentsData]);


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

  const handleSendAllFormData = () => {
    return Promise.all(
        componentRefs.current.map((ref) => {
            if (ref && ref.handleSendFormData) {
                return ref.handleSendFormData();
            }
            return Promise.resolve();
        })
    );
  };


  const handleRemoveComponent = (id) => {
    setComponentsData((prevData) => prevData.filter((data) => data.id !== id));
  };

  const uploadBlog = async () => {
    await handleSendAllFormData();
    setAllFormDataUpdated(true);
  };

  if(auth.isAuthenticated && getRolesContains(["blogger", "admin"], auth.user.profile["cognito:groups"])) {
    return (
      <div>
          <Typography variant='h3'>
          Blog Builder 
          </Typography>
          { !uploaded && <div>
          {componentsData.map((data, index) => (
                <BlogSectionComponent
                    key={data.id}
                    id={data.id}
                    onFormData={handleFormData}
                    onRemove={handleRemoveComponent}
                    ref={(ref) => (componentRefs.current[index] = ref)}
                />
            ))}
          <Box pt={2} pb={2} textAlign='center'>
            <Grid2 container textAlign="center" spacing={2}>
              <Button sx={{ width: "40%" }} variant="contained" onClick={handleAddComponent}>
                Add Another Section
              </Button>
              <Button sx={{ width: "40%" }} variant="contained" onClick={uploadBlog}>
                  Upload Blog
              </Button>
            </Grid2>
          </Box>
          </div> }
          { uploaded &&           
          <Typography variant='h5'>
            Blog Uploaded Successfully! 
          </Typography>}
      </div>
    );
  } else {
    return (
      <div>Not authenticated</div>
    )
  }
}

export default CreateBlogPage;