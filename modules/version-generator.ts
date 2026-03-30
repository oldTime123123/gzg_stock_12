// modules/version-generator.ts
import { defineNuxtModule } from "@nuxt/kit";
import fs from "fs";
import path from "path";

export default defineNuxtModule({
  meta: {
    name: "version-generator",
    configKey: "versionGenerator",
  },
  setup(options, nuxt) {
    nuxt.hook("build:done", () => {
      const version = {
        version: Date.now(),
        buildTime: new Date().toISOString(),
        env: process.env.NODE_ENV,
      };

      const outputPath = path.resolve(
        nuxt.options.buildDir,
        "../public/version.json"
      );
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, JSON.stringify(version, null, 2));

    });
  },
});
