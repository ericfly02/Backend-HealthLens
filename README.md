# Back-End HealthLens Application

This repository deploys the back-end functionality of our HealthLens application. It is through the deployment of this back-end service that our HealthLens application allows for persistent user-data, login/authentication functionality, and enables correct routing for all of our additional features (such as our custom email report functionality, our doctor-finder tool, or our WatsonAssistant-powered chatbot). This document will be organized by having a general [structure](#structure) layout of the repo and an explanation as to the [context of the larger project](#context-of-larger-project). 

## Structure

The `controllers/` directory establishes the logic for handling each of the features specified (email, authentication, doctor-finder, etc.) and ensuring that they are handled correctly by the backend. 

The `middlewares/` directory contains middleware for request verificatoin. `authMiddleware.js` sets up a file upload middleware using Multer. It configures storage for uploaded files, specifying the destination directory and generating unique filenames. `upload.js` implements an authentication middleware that verifies JWT tokens in the request header, ensuring secure access to protected routes.

The `models/` directory defines three functions for user management using Supabase as the database. It includes methods to create a new user, find a user by email, and find a user by ID (excluding the password field). These functions utilize Supabase's query builder to interact with the 'users' table in the database.

The `routes/` directory defines the routes to be used by each service so that the application is well-contoured and middlewares are applied.

## Context of Larger Project

The contents of this back-end service ensure that the user has continuous access to their own unique data with sufficient security guarantees. This builds on our mission to provide users preliminary diagnoses to people unable to reliably access medical expertise and lower the barrier to intentional medical care by allowing users to reference previous diagnoses and send easy-to-read detailed diagnosis reports, among other capabilities. This integrates seamlessly with our other services, and with our Flask Service and Front-End Service, this ensemble creates our entire HealthLens application.

## License and Contributing

Please refer to our [main project repository](https://github.com/ericfly02/Frontend-HealthLens
) for the license and contribution information. 