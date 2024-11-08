from http.server import BaseHTTPRequestHandler, HTTPServer
import os

hostName = "127.0.0.1"
serverPort = 8080

class MyServer(BaseHTTPRequestHandler):
        def do_GET(self):
                path = self.path
                _, file_extension = os.path.splitext(path)

                if file_extension == '.html':
                        self.send_response(200)
                        self.send_header("Content-type", "text/html")
                        self.end_headers()
                        with open('text.html', 'rb') as file:
                                content = file.read()
                        self.wfile.write(content)
                elif file_extension == '.jpeg':
                        self.send_response(200)
                        self.send_header("Content-type", "image/jpeg")
                        self.end_headers()
                        f = open('images.jpeg', 'rb')
                        self.wfile.write(f.read())
                        f.close()
                else:
                        self.send_response(200)
                        self.send_header("Content-type", "text/html")
                        self.end_headers()
                        with open('credentials.html', 'rb') as file:
                                content = file.read()
                        self.wfile.write(content)
        def do_HEAD(self):
                if(self.path == "/text"):
                        self.send_response(200)
                        self.send_header("Content-type", "text/html")
                        self.end_headers()
                if(self.path == "/image"):
                        self.send_response(200)
                        self.send_header("Content-type", "image/text")
                        self.end_headers()

if __name__ == "__main__":
        webServer = HTTPServer((hostName, serverPort), MyServer)
        print("Server started http://%s:%s" % (hostName, serverPort))
        try:
                webServer.serve_forever()
        except KeyboardInterrupt:
                pass

        webServer.server_close()
        print("Server stopped.")