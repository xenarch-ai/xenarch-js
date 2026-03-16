import { build, context } from "esbuild";

const isWatch = process.argv.includes("--watch");

const config = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  outfile: "dist/l.js",
  globalName: "__xenarch",
};

if (isWatch) {
  const ctx = await context(config);
  await ctx.watch();
  console.log("Watching for changes...");
} else {
  await build(config);
  const fs = await import("fs");
  const stat = fs.statSync("dist/l.js");
  console.log(`Built dist/l.js (${stat.size} bytes)`);
}
