import { Button, IconButton, TextareaAutosize } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import React, { forwardRef } from 'react';
import DropdownForm from './dropdownForm';
import UploadButton from './uploadButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'
import '../css/bouncingLoader.css';

const textVariants = ["None", "h1", "h2", "h3", "h4", "h5", "h6", "subtitle1", "subtitle2", "body1", "body2", "caption", "overline"]


const BlogSectionComponent = forwardRef(({ id, onFormData, onRemove  }, ref) => {
    const [contentType, setContentType] = React.useState('');
    const [sectionHeaderType, setSectionHeader] = React.useState('');
    const [sectionHeaderText, setSectionHeaderText] = React.useState('');
    const [sectionSubHeaderText, setSubHeaderText] = React.useState('');
    const [sectionSubHeaderType, setSubHeader] = React.useState('');
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [fileUploading, setFileUploading] = React.useState(false);
    const [fileUploaded, setFileUploaded] = React.useState(false);
    const [blogText, setBlogText] = React.useState("");
    const [presignedUrl, setPresignedUrl] = React.useState('');
    const [key, setKey] = React.useState('');
    const fileInputRef = React.useRef(null);


    const handleSendFormData = () => {
        return new Promise((resolve) => {
            const formData = {
                sectionHeaderType,
                sectionHeaderText,
                sectionSubHeaderType,
                sectionSubHeaderText,
                contentType,
                blogText,
                key,
            };

            onFormData(id, formData);
            resolve();
        });
    };

    React.useImperativeHandle(ref, () => ({
        handleSendFormData: handleSendFormData,
    }));

    const handleRemoveClick = () => {
        onRemove(id);
    };

    

    const handleContentType = (event) => {
        setContentType(event.target.value);
    };
    
    const handleSectionHeader = (event) => {
        setSectionHeader(event.target.value);
    };

    const handleSectionHeaderText = (event) => {
        setSectionHeaderText(event.target.value);
    };

    const handleSubHeader = (event) => {
        setSubHeader(event.target.value);
    };

    const handleSubHeaderText = (event) => {
        setSubHeaderText(event.target.value);
    };

    const handleFileChange = async (event) => {
        setSelectedFile(event.target.files[0]);
        console.log(event.target.files[0].name)
        try {
            const ID_TOKEN = JSON.parse(localStorage.getItem('user')).id_token
            const key = `${uuidv4()}/${event.target.files[0].name}`
            await axios.get(`${process.env.REACT_APP_API_GATEWAY_BASE_URL}/get_presigned_url?key=${key}`, { headers: {"Authorization": ID_TOKEN, "Content-Type": "application/json"}}).then( resp => {
                setKey(key)
                setPresignedUrl(resp.data.data.url)
            });
        } catch (error) {
            console.error('Error getting presigned URL:', error);
        }
    };

    const handleBlogText = (event)=>{
        setBlogText(event.target.value);
    }

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    
  
    const sendFilePresignedUrl = async () => {
        try {
            setFileUploading(true)
            const response = await axios.put(presignedUrl, selectedFile, {headers : { "Content-Type" : selectedFile.type}})
            setFileUploaded(true)
            setFileUploading(false)
            console.log(response)
        } catch (error) {
            console.error('Error getting presigned URL:', error);
        }
    }

    const sectionHeaderDropdown = {
        value: sectionHeaderType,
        label: "Header Type",
        options: textVariants,
        onChange: handleSectionHeader
    }

    const subHeaderDropdown = {
        value: sectionSubHeaderType,
        label: "Sub-Header Type",
        options: textVariants,
        onChange: handleSubHeader
    }

    const contentTypeDropdown = {
        value: contentType,
        label: "Content Type",
        options: ["Text", "Image/Video"],
        onChange: handleContentType
    }

    const buttonInputs = {
        onClick: handleButtonClick,
        fileInputRef: fileInputRef,
        onChange: handleFileChange,
        selectedFile: selectedFile
    }
    return (
        <div>
            <Box sx={{bgcolor:"rgba(255, 255, 255, 0.5)"}}>
                <IconButton aria-label="delete" onClick={handleRemoveClick}>
                    <DeleteIcon />
                </IconButton>
                <Grid container spacing={2} pl={2} pt={2} pb={2}>
                    <Grid size={4}> 
                        <DropdownForm dropdownInputs={sectionHeaderDropdown}/>
                    </Grid>
                    { sectionHeaderType !== "None" ?
                    <Grid size={8}> 
                        <TextareaAutosize style={{width: "90%"}} aria-label="minimum height" minRows={4} placeholder="Insert Sub-header Here" onChange={handleSectionHeaderText}/> 
                    </Grid> :
                    <Grid size={8}> 
                        <div></div> 
                    </Grid>
                    }
                    <Grid size={4}> 
                        <DropdownForm dropdownInputs={subHeaderDropdown}/>
                    </Grid>
                    { sectionSubHeaderType !== "None" ?
                    <Grid size={8}> 
                        <TextareaAutosize style={{width: "90%"}} aria-label="minimum height" minRows={4} placeholder="Insert Sub-header Here" onChange={handleSubHeaderText}/> 
                    </Grid> :
                    <Grid size={8}> 
                        <div></div> 
                    </Grid>
                    }
                    <Grid size={4}> 
                        <DropdownForm dropdownInputs={contentTypeDropdown}/>
                    </Grid>
                    <Grid size={8}>
                        {contentType ===  "Text" ? <TextareaAutosize style={{width: "100%"}} aria-label="minimum height" minRows={4} placeholder="Insert Blog Text Content" onChange={handleBlogText}/> 
                        : contentType ===  "Image/Video" ?
                        <UploadButton buttonInputs={buttonInputs}/>
                         : <div></div>
                        }
                    </Grid>
                    
                    {!fileUploaded && <Grid size={4}> 
                        { selectedFile && <Button variant='contained' onClick={sendFilePresignedUrl}>Upload Button</Button>}
                    </Grid> }
                    { fileUploading && <Grid size={4}> 
                        { selectedFile && 
                            <div className="loader-container">
                                <div className="bouncing-square"></div>
                            </div>
                        }
                    </Grid> }
                    { fileUploaded && <Grid size={4}> 
                        { selectedFile && <div>Uploaded Successfully!</div>}
                    </Grid> }
                    <Grid size={8}> 
                        <div></div>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
})

export default BlogSectionComponent