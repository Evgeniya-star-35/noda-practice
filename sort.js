import fs from "fs/promises";
import path from "path";

class SortFiles {
  #dist;
  constructor(dist) {
    this.#dist = dist;
  }

  async #copyFile(file) {
    const nameTargetDir = path.extname(file.name); //расширение .jpg
    const targetDir = path.join(this.#dist, nameTargetDir); // dist/.jpg
    try {
      await fs.mkdir(targetDir, { recursive: true }); //recursive-если есть,не надо создавать
      await fs.copyFile(file.path, path.join(targetDir, file.name));
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
  async readFolder(base) {
    const files = await fs.readdir(base);
    for (const item of files) {
      const localeBase = path.join(base, item);
      const state = await fs.stat(localeBase); // stat определяет,что за тип
      if (state.isFile()) {
        await this.#copyFile({ name: item, path: localeBase });
      } else {
        await this.readFolder(localeBase);
      }
    }
  }
}

export default SortFiles;
