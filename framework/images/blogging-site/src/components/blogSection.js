import { IconButton, TextareaAutosize } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import React, { forwardRef } from 'react';
import DropdownForm from './dropdownForm';
import UploadButton from './uploadButton';
import DeleteIcon from '@mui/icons-material/Delete';

const textVariants = ["h1", "h2", "h3", "h4", "h5", "h6", "subtitle1", "subtitle2", "body1", "body2", "caption", "overline"]


const BlogSectionComponent = forwardRef(({ id, onFormData, onRemove  }, ref) => {
    const [contentType, setContentType] = React.useState('');
    const [sectionHeaderType, setSectionHeader] = React.useState('');
    const [sectionHeaderText, setSectionHeaderText] = React.useState('');
    const [sectionSubHeaderText, setSubHeaderText] = React.useState('');
    const [subHeaderType, setSubHeader] = React.useState('');
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [blogText, setBlogText] = React.useState("");
    const fileInputRef = React.useRef(null);

    const handleSendFormData = () => {
        const formData = {
            sectionHeaderType,
            sectionHeaderText,
            subHeaderType,
            sectionSubHeaderText,
            contentType,
            selectedFile,
            blogText
        };
        onFormData(id, formData);
    };

    React.useImperativeHandle(ref, () => ({
        handleSendFormData: handleSendFormData, // Expose the function
    }));

    const handleRemoveClick = () => {
        onRemove(id); // Call removal callback
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

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleBlogText = (event)=>{
        setBlogText(event.target.value);
    }

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const sectionHeaderDropdown = {
        value: sectionHeaderType,
        label: "Header Type",
        options: textVariants,
        onChange: handleSectionHeader
    }

    const subHeaderDropdown = {
        value: subHeaderType,
        label: "Sub-Header Type",
        options: ["None"].concat(textVariants),
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
                    <Grid size={8}> 
                        <TextareaAutosize style={{width: "90%"}} aria-label="minimum height" minRows={4} placeholder="Insert Section Title Here" onChange={handleSectionHeaderText}/> 
                    </Grid>
                    <Grid size={4}> 
                        <DropdownForm dropdownInputs={subHeaderDropdown}/>
                    </Grid>
                    { subHeaderType !== "None" ?
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
                </Grid>
            </Box>
        </div>
    )
})

export default BlogSectionComponent