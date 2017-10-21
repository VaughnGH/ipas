import redis, threading, logging;

class WebSocketListener(threading.Thread):
    # Original source : https://gist.github.com/jobliz/2596594
    def __init__(self, redis_conn, websocket, channels=['notes']):
        threading.Thread.__init__(self)
        self.redis = redis_conn
        self.websocket = websocket
        self.pubsub = self.redis.pubsub()
        self.pubsub.subscribe(channels)
        logging.info('exec connected')
    
    def run(self):
        for item in self.pubsub.listen():
            if not self.websocket.closed:  # FIXME : The thread won't terminate until an obj appears here, this can be problematic b.c. a subsciber will still exist despite not having a proper desination (e.g. websocket)
                message = item['data']
                logging.info('sub %s' % message)
                self.websocket.send(message)
            else:
                self.pubsub.unsubscribe()
                logging.info('exec disconnected')
                break

