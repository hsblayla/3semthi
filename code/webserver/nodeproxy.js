const http = require("node:http");

const handle_request_name_based = (req, res) => {
    let hostname = req.headers.host;

    const hostname_cur = hostname.split(":")[0]
    // Überschreibe Host für localhost-Weiterleitung
    if (hostname === `${hostname_cur}:8081`) {
        hostname = `${hostname_cur}:8080`;
    }

    const reqLink = `http://${hostname}${req.url}`;
    console.log(`Forwarding request to: ${reqLink}`);

    // Anfrage weiterleiten
    const proxyReq = http.request(
        reqLink,
        {
            method: req.method, // HTTP-Methode weiterleiten
            headers: req.headers, // Header-Weiterleitung
        },
        (proxyRes) => {
            // Statuscode und Header kopieren
            res.writeHead(proxyRes.statusCode, proxyRes.headers);

            // Antwortdaten weiterleiten
            proxyRes.pipe(res);
        }
    );
    req.pipe(proxyReq);
};

// Proxy-Server einrichten
const hostname = "127.0.0.1";
const port = 8081;
const server = http.createServer((req, res) => {
    handle_request_name_based(req, res);
});

server.listen(port, hostname, () => {
    console.log(`Proxy running at http://${hostname}:${port}/`);
});
  