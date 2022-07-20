FROM node:18-alpine AS development

# user the default user the container comes with
RUN mkdir /code && chown -R node:node /code
WORKDIR /code

USER node

# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install

# Copy app files
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD [ "yarn", "dev" ]


FROM node:18-alpine AS builder

WORKDIR /code

# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn build --production

# Copy app files
COPY . .

FROM nginx:1.23.0-alpine as production

ENV USER=diapers
ENV UID=10001

RUN adduser --disabled-password \
    --gecos "" --home "/code" \
    --shell "/sbin/nologin" \
    --no-create-home --uid "${UID}" \
    "${USER}"

USER $USERNAME

COPY --from=builder /code/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
