const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Define the quality percentages and corresponding output suffixes
const qualities = [
	{ quality: 20, suffix: "-mobile" },
	{ quality: 30, suffix: "-tablet" },
	{ quality: 40, suffix: "-desktop" },
];

// Function to convert images in a specific folder
const convertImages = (inputFolder) => {
	fs.readdirSync(inputFolder).forEach((file) => {
		const filePath = path.join(inputFolder, file);
		const isDirectory = fs.statSync(filePath).isDirectory();

		if (isDirectory) {
			// If the current file is a directory, recursively call the function
			const subfolder = path.basename(filePath);
			const newInputFolder = path.join(inputFolder, subfolder);
			convertImages(newInputFolder);
		} else {
			// If the current file is an image file, convert it to WebP
			qualities.forEach((quality) => {
				const { suffix, quality: q } = quality;
				const fileName = path.basename(file, path.extname(file));
				const outputFilePath = path.join(
					inputFolder,
					`${fileName}${suffix}.webp`
				);
				const command = `cwebp -q ${q} "${filePath}" -o "${outputFilePath}"`;

				exec(command, (error, stdout, stderr) => {
					if (error) {
						console.error(
							`Error converting ${file} to ${suffix}: ${error.message}`
						);
					} else {
						console.log(`Converted ${file} to ${suffix}`);
					}
				});
			});
		}
	});
};

// Call the function for each input folder
convertImages("./assets/images");
// Add more folders as needed
