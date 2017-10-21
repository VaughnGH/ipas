import logging
import os
from tornado import web, ioloop, websocket
import tornado

logging.basicConfig(level=logging.INFO)

class Form(web.RequestHandler):
    def get(self):
        response = {'status' : 'success'}
        self.write(response)
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        self.set_header("Content-Type", "application/json")
        response = {'status' : 'success'}
        self.write(response)


settings = {
        'debug' : True,
        'static_path' : os.path.join(os.path.dirname(__file__), 'static')
        }
handlers = [
        (r'/api/v1/form', Form),
        ]

if __name__ == "__main__":
    logging.info("Starting webserver")
    application = web.Application(handlers, **settings)
    application.listen(80)
    ioloop.IOLoop.instance().start()
