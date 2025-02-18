# Project Title: English Grammar Quiz Application

## Overview
This application is designed to help users practice English grammar through a series of questions and interactive games. It utilizes AWS Amplify for backend services and GraphQL for data fetching.

## Directory Structure

### `src/`
- **App.js**: The main component that manages the application state and routing.
- **App.css**: Styles for the main application component.
- **App.test.js**: Tests for the `App` component.
- **aws-exports.js**: Automatically generated configuration file for AWS services.
- **index.js**: The entry point for the React application.
- **index.css**: Global styles for the application.
- **components/**: Contains reusable components.
  - **QuestionView.js**: Displays a question and its options.
  - **StartPage.js**: The initial screen for topic selection.
  - **Games.js**: Main component for managing game selection and navigation.
  - **components/games/**: Contains individual game components.
    - **GameSelector.js**: Menu interface for selecting different games.
    - **WordDropChallenge.js**: Interactive game for practicing vocabulary through drag-and-drop.
    - **MarkTheWords.js**: Game for identifying specific types of words in sentences.
- **graphql/**: Contains GraphQL queries, mutations, and subscriptions.
  - **queries.js**: Defines queries for fetching questions.
  - **mutations.js**: Defines mutations for data modifications.
  - **subscriptions.js**: Defines subscriptions for real-time updates.

### `public/`
- **favicon.ico**: The favicon for the application.
- **index.html**: The main HTML file.
- **logo192.png**: Application logo.
- **logo512.png**: High-resolution application logo.
- **manifest.json**: PWA configuration file.
- **robots.txt**: Web crawler instructions.

### `tests/`
- **queryTest.js**: Tests for GraphQL query functionality.

## Usage
To start the application, run `npm start` in the terminal. To create a production build, use `npm run build`.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.
