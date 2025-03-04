import { Button, Typography } from "@mui/material"

export default function UploadButton({buttonInputs}) {



    return (                        
    <div>
        <Button sx={{alig: "center", width: "90%" }} variant="contained" onClick={buttonInputs.onClick}>
            Upload File
        </Button>
            <input
                type="file"
                ref={buttonInputs.fileInputRef}
                style={{ display: 'none', width: "100%" }}
                onChange={buttonInputs.onChange}
            />
            {buttonInputs.selectedFile && (
                <Typography variant="body2" mt={2}>
                    Selected File: {buttonInputs.selectedFile.name}
                </Typography>
            )}
    </div>)
}