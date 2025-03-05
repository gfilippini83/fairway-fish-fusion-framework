import { Box, Typography, ImageList, ImageListItem, ListItem, ListItemText, List, Container } from '@mui/material';
import React from 'react';

function migrate(event) {
  window.open(event.target.currentSrc, '_blank')
}

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

function LandingPage() {
    const itemData = [
      {
        img: 'https://blog-fff-image-hosting-bucket.s3.us-east-1.amazonaws.com/Screenshot+2025-02-26+233025.png',
        title: 'Breakfast',
        rows: 3,
        cols: 4,
      },
      {
        img: 'https://blog-fff-image-hosting-bucket.s3.us-east-1.amazonaws.com/Screenshot+2025-03-03+120651.png',
        title: 'Burger',
        rows: 3,
        cols: 2,
      },
      {
        img: 'https://blog-fff-image-hosting-bucket.s3.us-east-1.amazonaws.com/Screenshot+2025-03-03+120705.png',
        title: 'Camera',
        rows: 3,
        cols: 2,
      }
    ];

    return (
      <div>
        <Container sx={{p:1}}>
          
        </Container>
        <Box sx={{bgcolor: "rgba(255, 255, 255, 0.5)", borderRadius: '16px', p: 15}}>
          <Typography variant='h2' sx={{ p: 5 }}>
          Welcome to Garrett Filippini's Project, Fairway Fish Fusion!
          </Typography>

          <Typography variant='h4' sx={{ p: 2 }} >
          Objective
          </Typography>

          <Typography variant='p'>
          The goal of this project is to showcase some of my abilities as an engineer working at a professional level. The idea came to me a while ago about leveraging my infrastructure as code (IaC) skillset to create a repository that could easily replicate a blogging application in different environments and concepts. You can see right now that this concept for a blog revolves around golfing and fly fishing and fusing it into a single blog. With all of the infrastructure saved as code, we can easily change the domain name, images, etc. to make a general blog about anything.
          </Typography>

          <ImageList
            sx={{ p: 10 }}
            variant="quilted"
            cols={4}
            rowHeight={121}
          >
            {itemData.map((item) => (
              <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
                <img
                  {...srcset(item.img, 121, item.rows, item.cols)}
                  alt={item.title}
                  loading="lazy"
                  onClick={migrate}
                />
              </ImageListItem>
            ))}
          </ImageList>

          <Typography variant='h4' sx={{ p: 2 }}>
          What has been accomplished to this point?
          </Typography>
          
          <Typography variant='body1'>
          As of now, all the code can be seen in my GitHub <a href="https://github.com/gfilippini83/fairway-fish-fusion-framework" target="_blank" rel="noopener noreferrer"> repository here</a>. In order to not sound redundant, I want to say once that everything listed below is fully managed in Terraform.
          </Typography>
          <List sx={{justifyContent: "center", display: "grid"}}>
            <ListItem>
              <ListItemText primary={`Fully Dryed Out IaC - The Terraform structure I went with for this project is formatted as follows - we have an environment directory that includes subdirectories with tfvar files  which store the environemnt/zone specific fields for a website. We then have module directories that have all the Terraform for each of the AWS resources that this application requires. The module directory is currently includes the following resources: API Gateway, Lambda, Cognito, Kubernetes Cluster/ECR, S3 Bucket, and a VPC configuration.`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`API Gateway Ingerated with Lambda - My previous role required me to make constant updates to our API Gateways, updating protobufs, pushing package changes to artifactories that could then be implemented on the lambda's themselves. Currently, we have a very basic lambda that gets a basic event and returns hello world. Can be access publicly currently which allows this URL to invoke that endpoint.`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`AWS Lambda - The lambda that is currently deployed to the backend, services two endpoints on our now private API Gateway. The base (/), and a new endpoint to get a presigned URL (/get_presigned_url). The base url was used for testing, and now with this second endpoint, our lambda is invoking S3, generating a presigned URL that we then send to the UI to upload images for the blogs to S3.`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`AWS Cognito - This allows the site to authenticate the user. Currently there is one group, Blogger, that allows anyone with the blogger role to access the create-blog page. People who sign up as new accounts on the site will not be assigned a role and will not have any blogger/admin level privileges. Using this service, we have now integrated with API Gateway to create an Authorizer which leverages the Congnito User Pool for this service. We now require a valid JWT token to access certain resources, and double check roles when accessing sensitive endpoints.`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Kubernetes Cluster/ECR - I have the React JS (Node 20) deployed to two worker pods on a Kubernetes cluster. The code for the images lives in our framework/images/<docker-image> directories. Similary to the lambda function, there is documentation on how to rebuild and deploy the functions to the worker pods in the README.md.`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`S3 Buckets - There are a few S3 buckets for this project, one to store lambda deployments, another functions as the backend for our Terraform State for the application, and the last one is a public bucket that allows read access and actually hosts the image URLs above. I do plan on deprecating the public facing S3 in favor of the private one I recently developed. The S3 bucket that we were provisioning the presigned URLs for is the new private one which will store all the images and videos that we plan to display on the site.`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`VPC Configuration - This is one resource that I have learned a lot more about through this project. This is where/how you can lock down the internal resources from the external internet. The set up currently has two private subnets, and two public subnets. The private subnets are routed through our NAT Gateway which allows for API requests out of the internal network and onto the internet, but does not allow the internet to access the internal resources. The public subnets are used for the LoadBalancer responsible for hosting the pods with the React code which go through the Internet Gateway (IW).`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Architectural Design - I have extensive experience designing software solutions. I typically use LucidChart or Miro. The one image linked above was the initial design for a user with no roles associated with it.`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Jira Board - Another area that I have extensive experience working in, is functioning in an agile framework. Most recently I was working in a Kanban structure but can easily adapt to more of a SCRUM style.`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Custom Domain - One last callout is how I connected this LoadBalancer to my custom domain, and integrated with SSL. Not to mention that this is one subdomain, you can easily create many more subdomains to host different environments for this service (or any service, very easy to do). My only stage currently deployed is production, but it would be incredibly easy to deploy the staging website prepended staging.fairwayfishfusion.com.`} />
            </ListItem>
          </List>
          <Typography variant='h4' sx={{ p: 2 }}>
              What's Next?
          </Typography>

          <Typography variant='body1'>
            The majority of this initial phase was spent perfecting the Terraform modules and infrastructure. I have since started working heavily on the frontend React interface as well as updating the lambdas in the backend to better service this frontend. I work in a continuous deployment fashion and I wanted to notify you, the readers, this site is undergoing changes every day! These are some of the things to look out for in the future:
          </Typography>
          <List sx={{justifyContent: "center", display: "grid"}}>
            <ListItem>
              <ListItemText primary={`Integrate Atlantis in GitHub`} /> <a href='https://www.runatlantis.io/' target="_blank" rel="noopener noreferrer">(Atlantis)</a>
            </ListItem>
            <ListItem>
              <ListItemText primary={`Add form for creating blogs for Blogger/Admin roles`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Improve landing page to populate blogs`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Incorporate ESLint`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Create GitHub Actions for Testing`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Create CodePipelines For Lambdas`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Improve Architectural Design Work to Include New Flows`} />
            </ListItem>
          </List>

          <Typography variant='h4' textAlign={"center"} sx={{ p: 2 }}>
              Stay In Touch!
          </Typography>
          
          <Typography variant='body1' textAlign={"center"}>
            My Links:
          </Typography>
          <List sx={{justifyContent: "center", display: "grid"}}>
            <ListItem>
              <ListItemText/><a href='https://www.linkedin.com/in/garrett-filippini-a27b90209/' target="_blank" rel="noopener noreferrer">(LinkedIn)</a>
            </ListItem>
            <ListItem>
              <ListItemText/><a href='https://blog-fff-image-hosting-bucket.s3.us-east-1.amazonaws.com/Resume+-+Garrett+Filippini.pdf' target="_blank" rel="noopener noreferrer">(Resume)</a>
            </ListItem>
            <ListItem>
              <ListItemText/><a href='https://github.com/gfilippini83/fairway-fish-fusion-framework' target="_blank" rel="noopener noreferrer">(This Repo)</a>
            </ListItem>
            <ListItem>
              <ListItemText/><a href='https://github.com/gfilippini83' target="_blank" rel="noopener noreferrer">(GitHub)</a>
            </ListItem>
          </List>
        </Box>
        
        <Container sx={{p:1}}>
          
        </Container>
        </div>
    );
  }

  export default LandingPage;