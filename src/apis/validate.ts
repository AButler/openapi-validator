import type { OpenAPI } from "openapi-types";
import { Request, Response } from "express";
import multer from "multer";
import yaml from "js-yaml";
import { ErrorCode, ValidationError, makeApiSpec } from "openapi-validator";
import { MyResponse } from "../lib/MyResponse";
import { isNumber } from "../lib/helpers";

export const validateUploads = (upload: multer.Multer) =>
  upload.fields([
    { name: "specification", maxCount: 1 },
    { name: "responseBody", maxCount: 1 },
  ]);

export const validate = (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const specification = files["specification"][0];
  const responseBody = files["responseBody"][0];
  const requestUrl = req.body.requestUrl;
  const requestMethod = req.body.requestMethod;
  const responseStatus = req.body.responseStatus;

  if (!specification) {
    res.status(400).send("specification is required");
    return;
  }
  if (!responseBody) {
    res.status(400).send("responseBody is required");
    return;
  }
  if (!requestUrl) {
    res.status(400).send("requestUrl is required");
    return;
  }
  if (!requestMethod) {
    res.status(400).send("requestMethod is required");
    return;
  }
  if (!responseStatus) {
    res.status(400).send("responseStatus is required");
    return;
  }
  if (!isNumber(responseStatus)) {
    res.status(400).send("responseStatus must be a number");
    return;
  }

  let requestBodyJson;

  try {
    requestBodyJson = JSON.parse(responseBody.buffer.toString());
  } catch (e) {
    console.error("Invalid requestBody JSON", e);
    res.status(400).send("requestBody must be valid JSON");
    return;
  }

  let specificationObject;
  try {
    specificationObject = yaml.load(
      specification.buffer.toString()
    ) as OpenAPI.Document<{}>;
  } catch (e) {
    console.error("Invalid specification JSON/YAML", e);
    res.status(400).send("specification must be valid JSON or YAML");
    return;
  }

  const spec = makeApiSpec(specificationObject);

  const response = new MyResponse(
    requestUrl,
    requestMethod,
    +responseStatus,
    requestBodyJson
  );

  const validationError = spec.validateResponse(response);

  var result = {
    isValid: validationError === null,
    errors: toFriendlyError(validationError),
  };

  res.status(200).json(result);
};

function toFriendlyError(validationError: ValidationError | null) {
  if (!validationError) {
    return null;
  }

  return {
    code: toFriendlyErrorCode(validationError.code),
    message: validationError.message,
    name: validationError.name,
  };
}

function toFriendlyErrorCode(code: ErrorCode) {
  const lookup = [
    "ServerNotFound",
    "BasePathNotFound",
    "PathNotFound",
    "MethodNotFound",
    "StatusNotFound",
    "InvalidBody",
    "InvalidObject",
  ];

  return lookup[code];
}
