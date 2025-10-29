# Sarahah_App

## Overview

This repository contains the backend code for a Sarahah-like application, built with JavaScript, Express.js, and Node.js. It allows users to send and receive anonymous messages.

## Key Features & Benefits

*   **User Authentication:** Secure user registration and login.
*   **Message Sending:** Ability for users to send anonymous messages to other users.
*   **Message Receiving:** Users can receive anonymous messages.
*   **Token Blacklisting:** Prevents the reuse of invalidated tokens.
*   **Data Validation:** Ensures data integrity through validation middleware.
*   **Authorization:** Role-based access control for different functionalities.

## Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

*   **Node.js:** Version 22.15.0 or higher.
*   **npm:** (Usually included with Node.js)
*   **MongoDB:** A running instance of MongoDB for data storage.
*   **Git:** For cloning the repository.

## Installation & Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/MoAshrafX0/Sarahah_App.git
    cd Sarahah_App
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

    Create a `.env` file in the root directory with the following variables:

    ```
    NODE_ENV=development
    DB_URL_local=<Your MongoDB Connection String>
    JWT_SECRET=<Your Secret Key for JWT>
    REFRESH_TOKEN_SECRET=<Your Secret Key for Refresh Token>
    CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
    CLOUDINARY_API_KEY=<Your Cloudinary API Key>
    CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
    PORT=<Your Port, e.g. 3000>
    ```
    Replace the placeholder values with your actual credentials and connection string.

4.  **Run the application:**

    For development:

    ```bash
    npm run dev
    ```

    For production:

    ```bash
    npm start
    ```

## Usage Examples & API Documentation

### API Endpoints

| Method | Endpoint              | Description                                  | Request Body                                                                                                                                                                     | Response Body                                                                                                                                   |
| ------ | --------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /api/users/register   | Registers a new user.                        | `{firstName: string, lastName: string, email: string, password: string, gender: string(enum), age: number, phone: string}`                                                       | `{message: string, user: object}`                                                                                                               |
| POST   | /api/users/login      | Logs in an existing user.                   | `{email: string, password: string}`                                                                                                                                              | `{message: string, token: string, refreshToken: string}`                                                                                       |
| POST   | /api/users/logout     | Logs out a user by invalidating their token. | `{refreshToken: string}`                                                                                                                                                     | `{message: string}`                                                                                                                               |
| POST   | /api/messages         | Sends a message.                             | `{content: string, receiverdId: string}`                                                                                                                                         | `{message: string, message: object}`                                                                                                             |
| GET    | /api/messages         | Gets all messages for the logged in user     | None                                                                                                                                                                           | `[{content: string, receiverdId: string, createdAt: Date, updatedAt: Date, _id: string, __v: number}]`                                            |

### Code Snippets

**Registering a new user:**

```javascript
// Example using axios
const axios = require('axios');

axios.post('/api/users/register', {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'securePassword',
    gender: 'male',
    age: 25,
    phone: '123-456-7890'
})
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error(error);
});
```

## Configuration Options

The following environment variables can be configured:

*   `NODE_ENV`: Specifies the environment (development or production).
*   `DB_URL_local`: MongoDB connection string.
*   `JWT_SECRET`: Secret key for signing JWT tokens.
*   `REFRESH_TOKEN_SECRET`: Secret key for signing refresh tokens.
*   `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name.
*   `CLOUDINARY_API_KEY`: Cloudinary API key.
*   `CLOUDINARY_API_SECRET`: Cloudinary API secret.
*   `PORT`: Port on which the server will listen.

## Project Structure

```
├── .gitignore
├── jsconfig.json
├── package-lock.json
├── package.json
└── src/
    ├── DB/
    │   └── Models/
    │       ├── blacl-listed-tokens.model.js
    │       ├── messages.model.js
    │       ├── user.model.js
    │   ├── db.connection.js
    ├── Middlewares/
    │   ├── Validator.middleware.js
    │   ├── authentication.middleware.js
    │   ├── authorization.middleware.js
    │   ├── multer.middleware.js
    └── Modules/
        └── messages/
            ├── messages.controller.js
            └── messages.service.js
```

## Contributing Guidelines

Contributions are welcome! To contribute to this project, follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Submit a pull request.

Please ensure your code adheres to the project's coding standards and includes relevant tests.

## License Information

This project has no license specified. All rights are reserved.

## Acknowledgments

*   Express.js
*   Node.js
*   MongoDB
*   Mongoose
*   Cloudinary
