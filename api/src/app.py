import json
import logging
import os
import datetime
import tornado
from tornado import web, ioloop
from uuid import uuid4 as uuid
import redis

logging.basicConfig(level=logging.INFO)

WATER_REQ = {'hot' : 3.17, 'mild' : 1.59, 'cold' : 2.37}
REQ_FIELDS = {'start_date', 'end_date', 'num_pax', 'weather', 'avg_distance', 'num_vehicles', 'mre_per_day', 'ugr_per_day'} 
RESP_FIELDS = {'total_road_miles', 'meals_per_day', 'total_mre', 'total_ugr', 'num_days', 'water_per_day', 'total_water_req'}

redis_conn = redis.StrictRedis(host='redis', port=6379, db=0, charset="utf-8", decode_responses=True)

class FormEndpoint(web.RequestHandler):
    def get(self):
        response = json.dumps(list(redis_conn.keys()))
        self.set_header("Content-Type", "application/json")
        self.write(response)
    def post(self):
        form_dict, id_ = tornado.escape.json_decode(self.request.body), str(uuid())
        #json.dumps means potential alphabetically sorted keys, due to python's dict hash() for key alignment
        response = Form(form_dict).to_dict()
        redis_conn.set(id_, json.dumps({**form_dict, **response}))
        response['id'] = id_
        self.set_header("Content-Type", "application/json")
        self.write(response)
class FormRetrieve(web.RequestHandler):
    def get(self, id_):
        response = str(redis_conn.get(id_))
        self.set_header("Content-Type", "application/json")
        self.write(response)

class Form:
    def __init__(self, form_dict):
        date_format_str = "%Y-%m-%d"
        start_date = datetime.datetime.strptime(form_dict['start_date'], date_format_str)
        end_date = datetime.datetime.strptime(form_dict['end_date'], date_format_str)
        self.num_days = abs((end_date-start_date).days)
        self.total_road_miles = form_dict['avg_distance'] * form_dict['num_vehicles']
        self.total_mre = form_dict['mre_per_day'] * form_dict['num_pax'] * self.num_days
        self.total_ugr = form_dict['ugr_per_day'] * form_dict['num_pax'] * self.num_days
        self.meals_per_day = form_dict['mre_per_day'] + form_dict['ugr_per_day']
        self.water_per_day = WATER_REQ[form_dict['weather'].lower()]
        self.total_water_req = form_dict['num_pax'] * self.num_days * self.water_per_day
        self.total_fuel_req = self.total_road_miles / 6.0 # humveesvees have 4 to 8 mpg

    def to_dict(self):
        return self.__dict__
    def to_json(self):
        return json.dumps(self.to_dict())

settings = {
        'debug' : False, # FIXME : Toggle this for production
        'static_path' : os.path.join(os.path.dirname(__file__), 'static')
        }
handlers = [
        (r'/form', FormEndpoint),
        (r'/get/([A-Za-z0-9-]+)', FormRetrieve),
        ]

if __name__ == "__main__":
    logging.info("Starting webserver")
    application = web.Application(handlers, **settings)
    application.listen(80)
    ioloop.IOLoop.instance().start()
