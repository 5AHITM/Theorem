FROM node:latest As production
EXPOSE 3000
WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install
RUN npm run build
CMD ["npm", "start"]