import http.server
import requests
import socketserver

hostName = "127.0.0.1"
serverPort = 8080
proxyPort = 8081

class MyHandler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            print(f"Received Request for {self.headers.get('Host')}{self.path}")
            r = requests.get(f"http://127.0.0.1:{serverPort}{self.path}", headers=self.headers, stream=True)

            self.send_response(r.status_code)
            for header_key, header_value in r.headers.items():
                if header_key.lower() != 'transfer-encoding':  # optional, falls Transfer-Encoding: chunked verwendet wird
                    # lower() um case-sensitive zu vermeiden für Zeichenkettenvergleich
                    self.send_header(header_key, header_value)
            self.end_headers()

            # Inhalt in Blöcken an den Client senden
            for chunk in r.iter_content(4096):  # 4096-Byte-Blöcke für effizientes Streaming
                if chunk:
                    self.wfile.write(chunk)

Handler = MyHandler

with socketserver.TCPServer((hostName, proxyPort), Handler) as httpd:
    print("Proxy started on Port", proxyPort)
    httpd.serve_forever()