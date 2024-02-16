# OpenApi Validator Service

A web service for validating a JSON response against an OpenApi schema

# Build Container

```bash
docker build -t openapi-validator .
```

# Run container

```bash
docker run --name openapi-validator -d -p 3000:3000 openapi-validator
```

# Send request

Use `Validate.bru` request using [Bruno](https://usebruno.com)

> First time you use the collection, run `npm install`, e.g.

```bash
cd requests
npm install
```
