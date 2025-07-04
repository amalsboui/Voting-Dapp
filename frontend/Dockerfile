FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


# Add environment variable before build
ENV REACT_APP_BACKEND_URL=http://localhost:5000

RUN npm run build

# Serve with a lightweight web server
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]