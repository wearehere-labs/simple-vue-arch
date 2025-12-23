const { copyDirectory } = require("@ai.kozlov/file-tools");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  try {
    const apiName = await question("Enter the name for the new API package: ");

    if (!apiName || apiName.trim() === "") {
      console.error("Error: API name cannot be empty");
      rl.close();
      process.exit(1);
    }

    const targetDir = process.argv[2];

    if (!targetDir) {
      console.error("Error: Target directory not specified");
      console.log(
        "Usage: pnpm --filter @todo/api mpenny-add <target-directory>"
      );
      rl.close();
      process.exit(1);
    }

    const sourceDir = path.resolve(__dirname, "..");
    const destination = path.resolve(targetDir, apiName.trim());

    console.log(
      `\nCopying API package to ${destination} with name "${apiName.trim()}"...`
    );

    await copyDirectory(sourceDir, destination);

    console.log("API package copied successfully!");
    console.log(`\nNext steps:`);
    console.log(`1. Update package.json name in ${destination}`);
    console.log(`2. Update dependencies if needed`);
    console.log(`3. Run: cd ${destination} && pnpm install`);

    rl.close();
  } catch (error) {
    console.error("Error copying API package:", error);
    rl.close();
    process.exit(1);
  }
}

main();
