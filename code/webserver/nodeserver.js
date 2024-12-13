const handle_request_name_based = (req, res) => {

    //Logging so I can see it works
    console.log(`Hostname:${req.headers.host}`);
    
    const hostname = req.headers.host;
    const path = req.url;
    //Building Path to the files, including the host name, so we get name based hosting
    let filePath = __dirname + "/" + path;
    if (path == `/`) {
      filePath += `index.html`;
    }

    
    recievedhostname = req.headers.host.split(":")[0]; //split gibt array, [0] für zugriff auf erstes element

    switch(recievedhostname) {
        case 'web1.local': 
            readFileAndRespond(filePath, res, extension_map);
            break;
        case 'web2.local': 
            readFileAndRespond(filePath, res, extension_map);
            break;
        default: 
            res.statusCode = 404;
            res.write('<p>We do not serve the host: <b>' + req.headers.host + '</b>.</p>');
            res.end();
    }
  };

function readFileAndRespond(filePath, res, extension_map) {
    //Check if everything works
    console.log(`Path: ${filePath}`);
    const fs = require("node:fs");
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // Error reading the file
            res.writeHead(500);
            res.end("Error getting the file");
        } else {
            // File read successfully, send it
            let extension = filePath.split(".").pop(); // Get file extension
            console.log(`Extension: ${extension}`);
            const contentType = extension_map.get(extension) || "application/octet-stream"; // Default content type
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content);
        }
    });
}
  
  const extension_map = new Map();
  extension_map.set("html", "text/html");
  extension_map.set("png", "image/png");
  extension_map.set("jpg", "image/jpeg");
  extension_map.set("jpeg", "image/jpeg");
  extension_map.set("css", "text/css");


  const http = require("node:http");
  const hostname = "127.0.0.1";
  const port = 8080;
  const server = http.createServer((req, res) => {
    //Create the Server and deligate all requests to the function
    handle_request_name_based(req, res);
  });
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });