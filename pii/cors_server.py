#from http.server import HTTPServer, SimpleHTTPRequestHandler
#class CORSRequestHandler(SimpleHTTPRequestHandler):
#    def end_headers(self):
#        self.send_header('Access-Control-Allow-Origin', '*')
#        self.send_header('Access-Control-Allow-Methods', 'GET')
#        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
#        return super(CORSRequestHandler, self).end_headers()
#httpd = HTTPServer(('localhost', 8003), CORSRequestHandler)
#httpd.serve_forever()

try:
    # Python 3
    from http.server import HTTPServer, SimpleHTTPRequestHandler, test as test_orig
    import sys
    def test (*args):
        test_orig(*args, port=int(sys.argv[1]) if len(sys.argv) > 1 else 8000)
except ImportError: # Python 2
    from BaseHTTPServer import HTTPServer, test
    from SimpleHTTPServer import SimpleHTTPRequestHandler

class CORSRequestHandler (SimpleHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

if __name__ == '__main__':
    test(CORSRequestHandler, HTTPServer)
