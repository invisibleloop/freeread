import axios from "axios";
import inquirer from "inquirer";
import fs from "fs";
import wrap from "wrap-ansi";
import { spawn } from "child_process";
import ora from "ora";
import chalk from "chalk";
import yargs from "yargs";

const books = [
  {
    title: "Alice's Adventures in Wonderland by Lewis Carroll",
    downloadLink: "https://www.gutenberg.org/ebooks/11.epub.noimages",
  },
  {
    title: "The Time Machine by H. G. Wells",
    downloadLink: "https://www.gutenberg.org/ebooks/35.epub.noimages",
  },
];

async function downloadEpub(book) {
  const response = await axios.get(book.downloadLink, {
    responseType: "stream",
  });
  const writer = fs.createWriteStream(`${book.title}.epub`);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function convertEpubToTxt(bookTitle) {
  return new Promise((resolve, reject) => {
    const converter = spawn("ebook-convert", [
      `${bookTitle}.epub`,
      `${bookTitle}.txt`,
    ]);

    converter.on("close", resolve);
    converter.on("error", reject);
  });
}

async function formatTextWidth(bookTitle, mode) {
  const text = fs.readFileSync(`${bookTitle}.txt`, "utf8");
  const formattedText = wrap(text, 70);
  fs.writeFileSync(
    `${bookTitle}_formatted.txt`,
    mode === "light" ? chalk.black(formattedText) : chalk.white(formattedText)
  );
}

async function selectAndDownloadBook() {
  const argv = yargs(process.argv.slice(2)).option("mode", {
    alias: "m",
    describe: "Select the reading mode: light or dark",
    choices: ["light", "dark"],
    default: "light",
  }).argv;

  const mode = argv.mode;

  const { book } = await inquirer.prompt([
    {
      type: "list",
      name: "book",
      message: "Select a book to download and read:",
      choices: books.map((book) => book.title),
    },
  ]);

  const selectedBook = books.find((b) => b.title === book);

  if (selectedBook) {
    const spinner = ora(
      "Downloading and formatting text. Please wait."
    ).start();
    await downloadEpub(selectedBook);
    await convertEpubToTxt(selectedBook.title);
    await formatTextWidth(selectedBook.title, mode);
    spinner.stop();

    const bgColor = mode === "light" ? "ff/ff/ff" : "0/0/0";

    // Change the background color of the terminal window
    process.stdout.write(`\x1b]11;rgb:${bgColor}\x1b\\`);

    const lessProcess = spawn("less", [`${selectedBook.title}_formatted.txt`], {
      stdio: "inherit",
    });

    // Add event listener for the exit event of the process
    process.on("exit", () => {
      // Reset the terminal color to default
      process.stdout.write("\x1b]11;rgb:0/0/0\x1b\\");
      // Remove the generated files
      fs.unlinkSync(`${selectedBook.title}.epub`);
      fs.unlinkSync(`${selectedBook.title}.txt`);
      fs.unlinkSync(`${selectedBook.title}_formatted.txt`);
    });

    // Handle user quitting using Ctrl+C
    process.on("SIGINT", () => {
      lessProcess.kill(); // Kill the "less" process
      process.exit(); // Exit the application
    });
  } else {
    console.log("The selected book could not be found.");
  }
}

selectAndDownloadBook();
