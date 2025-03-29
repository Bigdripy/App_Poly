import { exec } from "child_process";

export function uploadToSmash(filePath) {
  return new Promise((resolve, reject) => {
    exec(`smash upload ${filePath} --json`, (error, stdout) => {
      if (error) reject("Erreur d'upload");
      resolve(JSON.parse(stdout));
    });
  });
}
