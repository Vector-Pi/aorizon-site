const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Normalize URL and resolve local path
  let parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;
  
  // Clean trailing slashes except for root
  if (pathname !== '/' && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  let localPath = path.join(__dirname, pathname);

  // Helper to serve file
  function serveFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Internal Server Error: ${err.code}`);
      } else {
        res.writeHead(200, { 
          'Content-Type': contentType,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
      }
    });
  }

  // Check path existence and clean URL routing
  fs.stat(localPath, (err, stats) => {
    if (!err) {
      if (stats.isDirectory()) {
        const indexHtml = path.join(localPath, 'index.html');
        fs.access(indexHtml, fs.constants.F_OK, (indexErr) => {
          if (!indexErr) {
            serveFile(indexHtml);
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1><p>Directory index file not found.</p>');
          }
        });
      } else {
        serveFile(localPath);
      }
    } else {
      // Path does not exist. Try appending .html (clean URL support)
      const htmlPath = localPath + '.html';
      fs.access(htmlPath, fs.constants.F_OK, (htmlErr) => {
        if (!htmlErr) {
          serveFile(htmlPath);
        } else {
          // If not found, serve index.html for client side routing SPA fallback
          const rootIndex = path.join(__dirname, 'index.html');
          fs.access(rootIndex, fs.constants.F_OK, (rootErr) => {
            if (!rootErr) {
              serveFile(rootIndex);
            } else {
              res.writeHead(404, { 'Content-Type': 'text/html' });
              res.end('<h1>404 Not Found</h1>');
            }
          });
        }
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  Midu Studio Replica Dev Server Running!`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`  Press Ctrl+C to stop.`);
  console.log(`======================================================\n`);
});
