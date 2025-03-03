import { Typography } from '@mui/material';
import React from 'react';

function LandingPage({ props }) {
    if (!props) {
      return <div>Loading Data Still.</div>;
    }

    return (
          <Typography variant='h2'>
          Landing Page {props} {process.env.NODE_ENV} {process.env.REACT_APP_BASE_URL}
          </Typography>
    );
  }

  export default LandingPage;