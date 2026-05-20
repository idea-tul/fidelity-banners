import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

/**
 * Vite plugin: convert any background PNG asset (originating from `bg.png`)
 * to JPG in the build output, and rewrite HTML/CSS/JS references.
 *
 * Runs in writeBundle after imagemin and Vite's html plugin have finished,
 * so it operates on final on-disk files.
 */
export default function convertBgToJpg({ quality = 92 } = {}) {
  return {
    name: "convert-bg-to-jpg",
    async writeBundle(options, bundle) {
      const outDir = options.dir || "dist";

      const renames = new Map(); // oldBaseName -> newBaseName

      for (const [fileName, asset] of Object.entries(bundle)) {
        if (asset.type !== "asset") continue;
        if (!/\.png$/i.test(fileName)) continue;

        const base = path.basename(fileName);
        const originalName = asset.originalFileName || asset.name || "";
        const isBg =
          /^bg[-.]/i.test(base) || /(^|[\/\\])bg\.png$/i.test(originalName);
        if (!isBg) continue;

        const fromPath = path.resolve(outDir, fileName);
        const toFileName = fileName.replace(/\.png$/i, ".jpg");
        const toPath = path.resolve(outDir, toFileName);

        const input = await fs.readFile(fromPath);
        const jpg = await sharp(input)
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .jpeg({ quality, mozjpeg: true, chromaSubsampling: "4:4:4" })
          .toBuffer();

        await fs.writeFile(toPath, jpg);
        await fs.unlink(fromPath);

        renames.set(base, path.basename(toFileName));
        console.log(
          `🖼  bg→jpg: ${base} → ${path.basename(toFileName)} (${jpg.length} B)`
        );
      }

      if (renames.size === 0) return;

      // Rewrite refs in any HTML/CSS/JS/SVG files on disk.
      const textExts = new Set([
        ".html",
        ".htm",
        ".css",
        ".js",
        ".mjs",
        ".svg",
        ".json",
      ]);

      async function walk(dir) {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            await walk(full);
          } else if (textExts.has(path.extname(entry.name).toLowerCase())) {
            const original = await fs.readFile(full, "utf8");
            let updated = original;
            for (const [oldBase, newBase] of renames) {
              updated = updated.split(oldBase).join(newBase);
            }
            if (updated !== original) {
              await fs.writeFile(full, updated);
            }
          }
        }
      }

      await walk(outDir);
    },
  };
}
