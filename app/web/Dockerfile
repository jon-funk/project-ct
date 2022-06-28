FROM node:18-alpine AS development

ENV NODE_ENV development

WORKDIR /code

ENV USER=diapers
ENV UID=10001

RUN adduser --disabled-password \
    --gecos "" --home "/code" \
    --shell "/sbin/nologin" \
    --no-create-home --uid "${UID}" \
    "${USER}"


USER $USERNAME

# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install

# Copy app files
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD [ "yarn", "start" ]


FROM node:18-alpine AS builder

ENV NODE_ENV production

WORKDIR /code

# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install --production

# Copy app files
COPY . .

RUN yarn build


FROM nginx:1.23.0-alpine as production

ENV USER=diapers
ENV UID=10001

RUN adduser --disabled-password \
    --gecos "" --home "/code" \
    --shell "/sbin/nologin" \
    --no-create-home --uid "${UID}" \
    "${USER}"

USER $USERNAME

ENV NODE_ENV production

COPY --from=builder /code/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
