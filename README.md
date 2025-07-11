

# British Council IELTS Interface Project

## Project Description

This project is an interface designed to mimic the British Council Computer-Based Reading Test interface. The system provides a dynamic, interactive environment for handling text panels and question panels, which is ideal for simulating the experience of the IELTS reading test. Key functionalities include:

* **Timer Management**: A timer tracks the elapsed time during the test.
* **Text and Note Highlighting**: Users can highlight text and add notes for later reference.
* **Dynamic Content Loading**: The ability to load content dynamically into the interface.
* **Question Navigation**: A system for managing navigation between different questions or sections.
* **Saving and Loading**: Users can save their answers and notes in local storage and retrieve them later.

## Installation Instructions

### Prerequisites

Before you begin, ensure that you have the following installed:

* **Node.js** (which includes NPM)

  You can download it from the official website: [https://nodejs.org/](https://nodejs.org/)

### Steps

1. **Clone the Repository** (if not already done):

   ```bash
   git clone <repository_url>
   ```

2. **Navigate to the Project Folder**:

   ```bash
   cd british_council_ielts_interface
   ```

3. **Install Dependencies**:
   Since this project requires Node Package Manager (NPM), you need to install the necessary packages by running:

   ```bash
   npm install
   ```

4. **Run the Project**:
   Once the dependencies are installed, you can start the project by running:

   ```bash
   http-server
   ```

5. **Access the Project**:
   Open your browser and go to `http://localhost:8080` to interact with the application.

   > **Note**: It's recommended that you use **Incognito Mode** in your browser to ensure that the cache and browsing history are clean, providing an optimal experience when using the test interface.

## Project Structure

Here’s a breakdown of the files and directories in the project:

* **`css/`**: Contains the stylesheets for the project.
* **`document/`**: Contains documentation files, such as the `doc_Js.pdf` that explains the JavaScript code.
* **`html/`**: HTML files that define the structure of the pages.
* **`index.html`**: The main entry point of the application, which is loaded in the browser.
* **`js/`**: Contains JavaScript files that implement the logic and functionalities of the system.

## Usage Instructions

### Key Features

* **Timer**: The system includes a built-in timer that begins when you start interacting with the interface. The timer can be reset or stopped at any time.
* **Text Highlighting**: You can highlight text by selecting it and choosing the highlight option. Notes can be added to the highlighted text.
* **Content Navigation**: The system allows you to easily navigate through questions, simulating a quiz-like interface.
* **Save and Load**: All your changes (notes, highlighted text, answers) are saved to the local storage of your browser and can be retrieved when you return to the interface.

### Interacting with the Application

* **Highlight Text**: Select any text and click on the highlight option to mark it.
* **Add Notes**: After highlighting text, a note box will appear, allowing you to add a note related to the text.
* **Timer**: The timer automatically begins when you start interacting with the page. You can reset or stop it at any time.
* **Local Storage**: Changes such as highlighted text and notes will be saved to your local storage and can be accessed again.

## Contributing

We welcome contributions! If you would like to contribute to the project, please fork the repository and submit a pull request. Be sure to include tests for any new features you add.

## License

This project is licensed under the MIT License.

