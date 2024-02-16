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

## Bruno

Use `Validate.bru` request using [Bruno](https://usebruno.com)

## cURL

```bash
curl --request POST \
  --url http://localhost:3000/validate \
  --header 'content-type: multipart/form-data' \
  --form requestUrl=<RequestUrl> \
  --form requestMethod=GET \
  --form responseStatus=200 \
  --form specification=@openapi-spec.yaml \
  --form responseBody=@response.json
```
