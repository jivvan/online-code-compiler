import { randomUUID } from "crypto";
import path from "path";
import fs, { rmSync } from "fs";
import { exec } from "child_process";
const tempDir = path.join(__dirname, "..", "temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

export const generateFile: (
  format: string,
  content: string
) => Promise<string> = async (format, content) => {
  const jobId = randomUUID();
  const filename = `${jobId}.${format}`;
  const filepath = path.join(tempDir, filename);
  await fs.writeFileSync(filepath, content);
  return filepath;
};

export const executeC = (filepath: string) => {
  const jobId = path.basename(filepath).split(".")[0];
  return new Promise((resolve, reject) => {
    exec(
      `docker run --rm -v ${tempDir}:/usr/src/output -w /usr/src/output gcc:latest /bin/bash -c "gcc -o ${jobId} ${jobId}.c && ./${jobId}"`,
      (error, stdout, stderr) => {
        rmSync(filepath);
        rmSync(path.join(tempDir, jobId));
        error && reject({ error, stderr });
        stderr && reject({ error });
        resolve(stdout);
      }
    );
  }).catch((err) => {
    console.log(err);
    return "some error occured";
  });
};
