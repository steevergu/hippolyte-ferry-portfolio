const http = require("http");
const fs = require("fs");
const path = require("path");
const ROOT = "/Users/hippolyte/Documents/webdesign/portfolio hippo";
const PORT = 3458;
const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".gif": "image/gif",
};
http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  const fp = path.join(ROOT, url === "/" ? "index.html" : url);
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end("Not found"); return; }
    res.writeHead(200, { "Content-Type": MIME[path.extname(fp)] || "text/plain" });
    res.end(data);
  });
}).listen(PORT, () => console.log("Serving on " + PORT));
