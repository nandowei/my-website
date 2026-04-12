import http.server
import socketserver
import os

os.chdir("/Users/fernandodelgado/Desktop/Claude/my-website")
PORT = 3000
Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
