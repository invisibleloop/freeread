# FreeRead

FreeRead is a Node.js script that allows you to download and read books from Project Gutenberg right in your terminal. It offers a unique and distraction-free reading experience.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) and npm (comes bundled with Node.js)
- [Calibre](https://calibre-ebook.com/download) for the `ebook-convert` command-line tool

## Installation

1. **Clone or download this repository** to your local machine.

2. **Navigate to the root directory of the script** in your terminal (the directory where the `package.json` file is located).

3. **Install the script's dependencies** by running:

    ```shell
    npm install
    ```

4. **Ensure `ebook-convert` is installed** and available in your terminal by running:

    ```shell
    ebook-convert --version
    ```

    This should print the version of `ebook-convert` if it's installed correctly.

    If not installed you can install using Homebrew (macOS).

    ```shell
    brew install calibre
    ```

## Usage

Once everything is set up, you can run the script using the npm script commands defined in the `package.json` file:

- **To read in light mode**, use:

    ```shell
    npm run read
    ```

- **To read in dark mode**, use:

    ```shell
    npm run read:dark
    ```

These commands will present you with a list of books. Choose one to download and read.

In this first version of "FreeRead" there are only two books to choose from. Eventually there will the ability to search for books available for free on Project Gutenberg.

While reading, you can scroll through the book using the arrow keys or the space bar. To exit the book and the script, press `q`. Upon exiting, the script will delete the downloaded and generated files.

## Troubleshooting

If you encounter issues:

- Make sure you have the latest version of Node.js and npm installed. The script may not work properly with older versions.
- Verify that you've installed all dependencies with `npm install`.
- Check if `ebook-convert` is properly installed and available in your terminal.
- If you still encounter problems, feel free to open an issue in this repository.

## License

This project is licensed under the ISC License.
