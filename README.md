# Simplex Tableau Study Tool

The Simplex Tableau Study Tool is a web application that helps users generate and study simplex tableaus for linear programming exercises. The tool allows users to customize the number of variables and constraints, set the animation speed, and choose the display format for the tableau.

## Features

- Generate random linear programming exercises with a specified number of variables and constraints.
- View the objective function and constraints in a readable format.
- Customize the display format (decimal or fraction).
- Adjust the animation speed for tableau operations.
- Study and interact with the generated simplex tableau.

## Getting Started

These instructions will help you set up and run the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js (https://nodejs.org/)
- npm (Node Package Manager, comes with Node.js)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/simplex-tableau-study-tool.git
    ```
2. Navigate to the project directory:
    ```sh
    cd simplex-tableau-study-tool
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

### Running the Application

To start the development server, run:
```sh
npm start
```
This will start the application on `http://localhost:3000`.

### Building for Production

To create a production build of the application, run:
```sh
npm run build
```
This will generate a `build` directory containing the production files.

## Project Structure

- `src/`: Contains the source code of the application.
  - `components/`: Contains React components.
  - `App.js`: Main application component.
  - `App.css`: Main stylesheet for the application.
- `public/`: Contains public assets and the `index.html` file.

## Usage

1. Use the dropdown menus to select the number of variables and constraints for the exercise.
2. Adjust the animation speed and display format as needed.
3. Click the "Generate Exercise" button to generate a new linear programming exercise.
4. Study the generated objective function and constraints.
5. Interact with the simplex tableau to solve the exercise.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that your code adheres to the project's coding standards and includes appropriate tests.

1. Fork the repository.
2. Create a new branch:
    ```sh
    git checkout -b feature/your-feature-name
    ```
3. Make your changes.
4. Commit your changes:
    ```sh
    git commit -m 'Add some feature'
    ```
5. Push to the branch:
    ```sh
    git push origin feature/your-feature-name
    ```
6. Create a pull request.


## Acknowledgements

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
