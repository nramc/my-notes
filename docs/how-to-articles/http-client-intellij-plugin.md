---
title: HTTP Client - IntelliJ Plugin
summary: A brief description of my document.
authors:
  - Waylan Limberg
  - Tom Christie
date: 2018-07-10
some_url: https://example.com
---

# HTTP Client - IntelliJ Plugin

- [HTTP Client](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) helps to create, edit, and
  execute HTTP requests directly in the IntelliJ IDEA code editor.
- It provides varies features like configuring env variable file with support for environments like dev, qa and live

## Environment files

- create environment file in project test source directory `src/test/http-client/http-client.env.json`
- Configure environment variables based on different environments

```json
{
  "dev": {
    "appURL": "https://example-dev.com"
  },
  "qa": {
    "appURL": "https://example-qa.com"
  },
  "live": {
    "appURL": "https://example.com"
  }
}
```

## HTTP Scripts

- please find below sample http script from `src/test/http-client/scripts/`

```

# Constant values
@usecase = REGISTRATION

### Registeration
# this is pre javascript block executed before http request executed
< {%
const pepperVal = request.environment.get("someConfidentialEnvironmentSpecificValue")
const dateUtcIsoFormat = new Date().toISOString().split('T')[0];
const formattedEntityVal = pepperVal + ':' + dateUtcIsoFormat;

const hashedEntity = crypto.sha256().updateWithText(formattedEntityVal, 'UTF-8').digest().toBase64(true);

// Dynamically derived value added to request context and can be used in http request
request.variables.set("dynamicHashedEntity", hashedEntity)

%}
POST {{appURL}}
Content-Type: application/vnd.registration+json

{
  "name": "My Name",
  "emailAddress": "my-email-address@example.com",
  "payload": "{\"signature\": \"{{hashedEntity}}\"}",
}

// this is post javascript block executed after http request executed
> {%
client.test("Request executed successfully", function () {
client.assert(response.status === 201, "Response failed");
client.global.set("emailToken", response.body.code)
});
%}

```