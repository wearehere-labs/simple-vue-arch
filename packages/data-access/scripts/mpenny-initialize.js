const { copyDirectory } = require("@ai.kozlov/file-tools");
const path = require("path");

const targetDir = process.argv[2];

if (!targetDir) {
  console.error("Error: Target directory not specified");
  console.log("Usage: node scripts/mpenny-initialize.js <target-directory>");
  process.exit(1);
}

const sourceDir = path.resolve(__dirname, "..");
const destination = path.resolve(targetDir);

console.log(`Copying data-access package from ${sourceDir} to ${destination}`);

copyDirectory(sourceDir, destination)
  .then(() => {
    console.log("Data-access package copied successfully");
  })
  .catch((error) => {
    console.error("Error copying data-access package:", error);
    process.exit(1);
  });
