import json
import logging
import os
import tornado
from tornado import web, ioloop

logging.basicConfig(level=logging.INFO)

WATER_REQ = {'hot' : 3.17, 'mild' : 1.59, 'cold' : 2.37}
req = {'start_date', 'end_date', 'num_pax', 'weather', 'avg_distance', 'num_vehicles', 'mre_per_day', 'ugr_per_day'} 
resp = {'total_road_miles', 'meals_per_day', 'total_mre', 'total_ugr', 'num_days', 'water_per_day', 'total_water_req'}

class FormEndpoint(web.RequestHandler):
    def get(self):
        response = {'status' : 'success'}
        self.write(response)
    def post(self):
        form_data = tornado.escape.json_decode(self.request.body)
        form = Form(form_data)
        self.set_header("Content-Type", "application/json")
        response = form.to_json()
        self.write(response)

class Form:
    def __init__(self, form_dict):
        self.total_road_miles = form_dict['avg_distance'] * form_dict['num_vehicles']
        self.total_mre = form_dict['mre_per_day'] * form_dict['num_pax'] * form_data['num_days']
        self.total_ugr = form_dict['ugr_per_day'] * form_dict['num_pax'] * form_data['num_days']
        self.meals_per_day = form_dict['mre_per_day'] + form_dict['ugr_per_day']
        self.water_per_day = WATER_REQ[form_dict['weather'].lower()]
        self.total_water_req = form_dict['num_pax'] * form_dict['num_days'] * self.water_per_day

    def to_dict(self):
        return self.__dict__
    def to_json(self):
        return json.dumps(self.to_dict())

settings = {
        'debug' : True,
        'static_path' : os.path.join(os.path.dirname(__file__), 'static')
        }
handlers = [
        (r'/api/v1/form', FormEndpoint),
        ]

if __name__ == "__main__":
    logging.info("Starting webserver")
    application = web.Application(handlers, **settings)
    application.listen(81)
    ioloop.IOLoop.instance().start()
