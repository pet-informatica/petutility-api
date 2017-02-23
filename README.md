# PET-Utility

## docker-compose.yaml

```
version: '2'

services:
  petutility:
    container_name: petutility
    build: ./petutility
    volumes:
      - ./petutility:/www
    depends_on:
      - postgres
    ports:
      - "80:3000"
    env_file:
      - locals.env
  postgres:
    container_name: postgres
    image: "postgres:9.6"
    environment:
      - POSTGRES_USER=pet
      - POSTGRES_PASSWORD=petutility!
      - POSTGRES_DB=database
    ports:
      - "5432:5432"
```

## locals.env

```
EMAIL_DESTINY=<global_email_destiny>
EMAIL_API=<mailgun_api_key>
EMAIL_DOMAIN=<mailgun_domain>
EMAIL=<mailgun_email>
NODE_ENV=development
CLOUDINARY_URL=<cloudinary_url>
DATABASE_URL=postgres://pet:petutility!@postgres:5432/database
PORT=3000
COOKIE_SECRET=HBJHjhvgvJVhgCVHJGvGHvcHgchgc%67&^%YFgcHGcJCJH
```