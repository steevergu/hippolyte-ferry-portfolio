import http.server
import os
import sys

PORT = 3458
os.chdir("/Users/hippolyte/Documents/webdesign/portfolio hippo")

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

httpd = http.server.HTTPServer(("", PORT), Handler)
print(f"Serving on {PORT}", flush=True)
httpd.serve_forever()
