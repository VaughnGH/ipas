FROM python:3
#-alpine
# Image docs : https://github.com/docker-library/docs/tree/master/python

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ./src/* ./

EXPOSE 80
ENTRYPOINT python app.py
#CMD ["python", "./app.py"]
