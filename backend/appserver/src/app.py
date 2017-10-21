import logging
import time
import redis
import os
from tornado import web, ioloop, websocket
import pandas as pd
import random

logging.basicConfig(level=logging.INFO)
sites = pd.read_csv('top-1m.csv')

class IndexHandler(web.RequestHandler):
    def get(self):
        self.render('html/index.html')

class GetSite(web.RequestHandler):
    def get(self):
        index = random.randint(1,1000000)
        response = {'site' : 'http://' + str(sites.iloc[index]["site"]) }
        self.write(response)


settings = {
        'debug' : True,
        'static_path' : os.path.join(os.path.dirname(__file__), 'static')
        }
handlers = [
        (r'/', IndexHandler),
        (r'/js/(.*)', web.StaticFileHandler, {'path' : 'js'}),
        (r'/site', GetSite),
        ]

if __name__ == "__main__":
    logging.info("Starting webserver")
    application = web.Application(handlers, **settings)
    application.listen(80)
    ioloop.IOLoop.instance().start()
