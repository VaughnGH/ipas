# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:latest

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

# Copy all local files into the image.
COPY ./ ./

RUN npm install

CMD npm run start
