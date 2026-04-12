#!/bin/sh
cd /Users/fernandodelgado/Desktop/Claude/my-website
exec python3 -c "
import http.server, socketserver, os
os.chdir('/Users/fernandodelgado/Desktop/Claude/my-website')
httpd = socketserver.TCPServer(('', 3000), http.server.SimpleHTTPRequestHandler)
httpd.serve_forever()
"
