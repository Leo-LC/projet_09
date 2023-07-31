const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Function to convert images in a specific folder
const reduceImageSize = (inputFolder) => {
	fs.readdirSync(inputFolder).forEach((file) => {
		const filePath = path.join(inputFolder, file);
		const isDirectory = fs.statSync(filePath).isDirectory();

		if (isDirectory) {
			// If the current file is a directory, recursively call the function
			const subfolder = path.basename(filePath);
			const newInputFolder = path.join(inputFolder, subfolder);
			reduceImageSize(newInputFolder);
		} else {
			// If the current file is an image file, convert it to WebP with 20% quality
			if (/\.(png|jpeg|jpg)$/i.test(file)) {
				const outputFilePath = filePath.replace(/\.(png|jpeg|jpg)$/i, ".webp");
				const quality = 20; // Set the desired quality (change as needed)

				// Execute the cwebp command to convert the image to webp with 20% quality
				const command = `cwebp -q ${quality} "${filePath}" -o "${outputFilePath}"`;

				exec(command, (error, stdout, stderr) => {
					if (error) {
						console.error(`Error converting ${file}: ${error.message}`);
					} else {
						console.log(`Converted ${file} to webp`);
					}
				});
			}
		}
	});
};

// Call the function for each input folder
reduceImageSize("./assets/images");
// Add more folders as needed
