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

console.log(`Copying domain package from ${sourceDir} to ${destination}`);

copyDirectory(sourceDir, destination)
  .then(() => {
    console.log("Domain package copied successfully");
  })
  .catch((error) => {
    console.error("Error copying domain package:", error);
    process.exit(1);
  });
