FROM node:8.12 as node

WORKDIR /app/service_one
COPY service_one/package.json /app/service_one
RUN npm install
COPY ./service_one /app/service_one

WORKDIR /app/service_two
COPY service_two/package.json /app/service_two
RUN npm install
COPY ./service_two /app/service_two

WORKDIR /app
COPY process.yml /app/

RUN npm install -g pm2
CMD ["pm2-runtime", "process.yml"]