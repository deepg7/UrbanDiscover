# UrbanDiscover

## Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/) installed on your machine.
- [npm](https://www.npmjs.com/) (Node Package Manager) installed on your machine.

### Installation

1. Clone the repository to your local machine:

    ```sh
    git clone https://github.com/deepg7/UrbanDiscover.git

2. Navigate to the cloned repository:

    ```sh
    cd UrbanDiscover

3. Install project dependencies:

    ```sh
    npm install

4. Create a .env file in the root directory of the project with reference to the sample.env file.

5. To run, use the command:

    ```sh
    npm start


### Additional Instructions

- **Default JWT Expiry**: The default expiry time for JWT (JSON Web Token) is set to 2 minutes for testing purposes. You can adjust this expiry time in the `model/User.js` file as needed.

- **Using makeAdmin**: After calling the `makeAdmin` function, please note that you will need to use the new JWT token for authentication, as the old token will be overwritten.

- **Password Reset**: To reset your password, follow these steps:
  1. Send your email in the body of a POST request to the `/user/resetPassword` route.
  2. If a user with the provided email exists, you will receive an OTP (One-Time Password) on the email address provided.
  3. Send this OTP, along with your new password and email, in the body of a POST request to the `/user/submitNewPassword` route to complete the password reset process.