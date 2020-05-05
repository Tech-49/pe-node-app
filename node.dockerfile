FROM node:latest

LABEL author="Hardik Raval"

ENV NODE_ENV=dev 
ENV PORT=3002

VOLUME ["/var/www"]

COPY      . /var/www
WORKDIR   /var/www

RUN       npm install

EXPOSE $PORT

ENTRYPOINT ["npm", "run", "dev"]