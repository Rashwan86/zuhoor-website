// tools/generate-ads-json.js
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ADS_DIR = path.join(ROOT, "public", "ads");

const isMedia = (f) => /\.(png|jpg|jpeg|webp|mp4|webm|ogg)$/i.test(f);

function typeOf(file) {
  return /\.(mp4|webm|ogg)$/i.test(file) ? "video" : "image";
}

function readFolder(rel) {
  const dir = path.join(ADS_DIR, rel);
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter(isMedia)
    .sort((a, b) => a.localeCompare(b, "en"));

  return files.map((f) => ({
    type: typeOf(f),
    src: `ads/${rel}/${f}`
  }));
}

function readLogo() {
  const items = readFolder("logo");
  const firstImg = items.find(x => x.type === "image");
  return firstImg ? firstImg.src : "";
}

const manifest = {
  logo: readLogo()
};

// media1..media10
for (let i = 1; i <= 10; i++) {
  manifest[`media${i}`] = readFolder(`media${i}`);
}

const outPath = path.join(ADS_DIR, "ads-manifest.json");
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2), "utf8");
console.log("✅ Generated:", outPath);