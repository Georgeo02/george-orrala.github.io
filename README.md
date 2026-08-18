# Portfolio Documentation

This README file provides an overview of the portfolio project, including setup instructions and a brief description of each file.

## Project Structure

The project consists of the following files:

- `index.html`: The main HTML file that contains the structure of the portfolio webpage. It includes a header with navigation links, sections for personal information, projects, certificates, and social media links. It also includes a script tag for loading JSON data and a script for dynamic content rendering.

- `styles.css`: This file contains the CSS styles for the portfolio. It defines variables for colors, resets default styles, and styles for the header, sections, buttons, and responsive design.

- `script.js`: This file contains JavaScript code that loads the JSON data, populates the HTML with personal information, projects, certificates, and social media links. It also handles the active navigation link based on the scroll position.

- `data.json`: This file contains structured data in JSON format, including personal information, projects, certificates, and social media links.

## Setup Instructions

1. **Clone the Repository**: 
   Clone this repository to your local machine using the following command:
   ```
   git clone <repository-url>
   ```

2. **Open the Project**: 
   Navigate to the project directory:
   ```
   cd portfolio
   ```

3. **Open `index.html`**: 
   Open the `index.html` file in your web browser to view the portfolio.

4. **Edit Content**: 
   You can modify the `data.json` file to update personal information, projects, and certificates. The changes will automatically reflect in the portfolio when you refresh the page.

5. **Customize Styles**: 
   Modify the `styles.css` file to change the appearance of the portfolio as per your preferences.

## Usage

- The portfolio is structured as a Single Page Application (SPA), allowing users to navigate between sections without reloading the page.
- The header contains links to different sections: INICIO (Home), PROYECTOS (Projects), CERTIFICADOS (Certificates), and social media icons.
- Each section is populated dynamically using data from the `data.json` file.

## License

This project is open-source and available under the [MIT License](LICENSE).