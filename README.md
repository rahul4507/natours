# Natours

Natours is a tour booking application that allows users to explore and book various tours around the world. This project is built with modern web technologies to provide a seamless and interactive user experience.

## Features

- Browse and search for tours
- View detailed information about each tour
- User authentication and authorization
- Book tours and manage bookings
- Responsive design for mobile and desktop

## Getting Started

Follow these instructions to set up the project on your local machine.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v12 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)
- [MongoDB](https://www.mongodb.com/) (for the database)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/natours.git
    ```

2. Navigate to the project directory:
    ```bash
    cd natours
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Set up environment variables:
    - Create a `.env` file in the root directory.
    - Add the following variables to the `.env` file:
        ```
        NODE_ENV=development
        DATABASE=mongodb://localhost:27017/natours
        DATABASE_PASSWORD=yourpassword
        JWT_SECRET=yourjwtsecret
        JWT_EXPIRES_IN=90d
        ```

### Running the Application

1. Start the development server:
    ```bash
    npm run start:dev
    ```

2. Open your browser and navigate to `http://localhost:3000`.

### Running Tests

To run the tests, use the following command:
```bash
npm test
```

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) for more information. --> working on this

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details. --> working on this

## Contact

If you have any questions or feedback, feel free to reach out to the project maintainer at [rahulhiragond04@gmail.com].
