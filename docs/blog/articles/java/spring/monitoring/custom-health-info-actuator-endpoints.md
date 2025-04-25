---
title: "Mastering Spring Boot Actuator: Deep Dive into Health Indicators & Info Contributors"
description: "todo"
author: Ramachandran Nellaiyappan
date:
  created: 2025-04-25
categories:
  - Java
tags:
  - Java
  - Spring Boot
  - Latest
links:
  - "[Author] Ram": https://nramc.github.io/my-profile/
---

# Mastering Spring Boot Actuator: Deep Dive into Health Indicators & Info Contributors

**TL;DR**:
Spring Boot Actuator gives you /health and /info endpoints out of the box—but don’t stop there.
Add custom checks for what really matters (like external services), share useful app info, and lock things down securely.
It’s a small effort that makes life way easier when things go sideways.

## Introduction

When it comes to production applications, there’s no room for ambiguity. You need to know **how your system is
performing** and **whether it's healthy** — without having to dive into logs or wait for something to break.

Spring Boot Actuator offers a set of endpoints like `/health` and `/info` that can give you key insights into your
application’s state. However, many developers miss out on the full potential of these endpoints by leaving them in their
default configuration.

In this article, we’ll explore why these endpoints are crucial for any production-grade application and provide
practical examples of how to use them effectively. You’ll learn how to enhance your health checks, improve
observability, and ensure that your system’s status is always clear—whether it’s running smoothly or facing issues.

## Application Health Indicators

**Health indicators** are used to check the health of various components in your application. They can be used to
monitor the status of databases, message brokers, and other services. Health indicators return a `Health` object that
contains information about the health status and any additional details.

The `/health` endpoint will return a simple JSON response indicating whether the application is up or down.

```json
{
  "status": "UP"
}
```

By default, SpringBoot does not include details and individual components in the health check response.
You can include them by setting the` management.endpoint.health.show-details` and
`management.endpoint.health.show-components` properties in your `application.properties` or `application.yml`

```yaml
management:
  endpoint:
    health:
      show-details: always # or "when_authorized"
      show-components: always # or "when_authorized"
```

and then you can see the details of the health check.

```json
{
  "status": "UP",
  "components": {
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 499963174912,
        "free": 277909123072,
        "threshold": 10485760,
        "path": "...",
        "exists": true
      }
    },
    "mail": {
      "status": "UP",
      "details": {
        "location": "localhost:1025"
      }
    },
    "mongo": {
      "status": "UP",
      "details": {
        "maxWireVersion": 21
      }
    },
    "ping": {
      "status": "UP"
    },
    "ssl": {
      "status": "UP",
      "details": {
        "validChains": [],
        "invalidChains": []
      }
    }
  }
}
```

!!! warning "Warning"

    The `/health` endpoint is not secured by default. Make sure `details` are not exposing sensitive information.
    If you are not sure, then set `management.endpoint.health.show-details` to `when_authorized` or `never`.

### The Default Health Check: Useful, But Limited

By default, Spring Boot checks the basic things like database connectivity, disk space, and a few other system metrics.
To know more about autoconfigured health indicators, refer to
the [Auto-configured HealthIndicators](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.health.auto-configured-health-indicators).

This is helpful for ensuring that the app is up and running from a technical standpoint, but in most production
environments, you need more.

For example:

- **Is the payment gateway service available?** If your payment service is down, your e-commerce platform is basically
  offline, but the default `/health` endpoint wouldn't tell you that.
- **Is your batch job running as expected?** If scheduled tasks are stuck, that could be impacting your app, but again,
  the default health check won’t capture that.
- **Are all external APIs reachable?** If your app relies on third-party APIs, it’s essential to monitor their
  availability—especially if they’re critical for functionality.
- **Is your message broker (like RabbitMQ or Kafka) up and running?** If you’re using a message broker for asynchronous
  processing, you need to ensure that it’s healthy.
- **Is your application’s circuit breaker configuration valid?** If you’re using Spring Cloud Netflix or Spring Cloud
  Resilience4j, you need to ensure that the circuit breaker configuration is valid and that there are no issues with
  circuit breaking.

### Custom HealthIndicator: How It Adds Value

To create a custom health indicator, you need to implement the `HealthIndicator` interface. This interface requires you
to implement the `health()` method, which returns a `Health` object. The `Health` object can contain various details
about the health status, including a status code (like UP or DOWN) and any additional information you want to provide.

Let’s say you need to monitor the connectivity to an external payment gateway. If the gateway is down, you can’t process
payments, and your users can’t make purchases.

Here’s how you can create a custom health indicator for that:

```java

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class PaymentGatewayHealthIndicator implements HealthIndicator {

    @Override
    public Health health() {
        boolean isPaymentServiceUp = checkPaymentService(); // Logic to check the payment gateway status
        if (isPaymentServiceUp) {
            return Health.up().withDetail("Payment Service", "Available").build();
        } else {
            return Health.down().withDetail("Payment Service", "Unavailable").build();
        }
    }

    private boolean checkPaymentService() {
        // Simulate the check, e.g., an HTTP request to the payment gateway
        return true;
    }
}
```

now you can see the status of the payment gateway in the `/health` endpoint:

```json
{
  "status": "UP",
  "components": {
    "diskSpace": {
      "status": "UP"
    },
    "mail": {
      "status": "UP"
    },
    "mongo": {
      "status": "UP"
    },
    "paymentGateway": {
      "status": "UP"
    },
    "ping": {
      "status": "UP"
    },
    "ssl": {
      "status": "UP"
    }
  }
}
```

### Custom Health Groups

You can also group health indicators into different categories. This is useful for separating infrastructure checks
(infra), external APIs (external), and application logic (core) for cleaner diagnostics.

To create a custom health group, you can use properties in your `application.properties` or `application.yml` file.

```yaml
management:
  endpoint:
    health:
      group:
        infra:
          include: diskSpace, mongo
        external:
          include: paymentGateway, mail
        core:
          include: ping, ssl
```

Now, when you access the grouped health endpoint as `/actuator/health/infra`, you’ll see the health status of the
infrastructure components:

```json
{
  "status": "UP",
  "components": {
    "diskSpace": {
      "status": "UP"
    },
    "mongo": {
      "status": "UP"
    }
  }
}
```

Please refer to
the [Spring Boot Actuator documentation](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.health)
for finer tuning options.

## Application Information Contributors

**Info contributors** are used to provide additional information about your application. This can include build
information, environment variables, and other metadata. Info contributors return an `Info` object that contains
key-value
pairs of information. They are typically used to enhance the `/info` endpoint of the actuator.

The `/info` endpoint in Spring Boot is often overlooked. Out of the box, it doesn’t do much—usually just shows an empty
JSON or a couple of basic build properties if configured. But with a little customization, it can become a powerful tool
for understanding your application’s state, environment, and versioning.

### What `/info` Can Tell You

The idea behind `/info` is simple: provide metadata about your application that can help with **diagnostics, version
tracking, or internal transparency**.

SpringBoot provides a few built-in info contributors, such as:

- `BuildProperties`: Provides information about the build, like version, artifact, and group.
- `GitInfo`: If you’re using Git, this contributor can provide information about the current commit, branch, and
  tags.
- `Environment`: Exposes environment variables and system properties.
- `System`: Provides system-related information like OS name, version, and architecture.
- `CustomInfoContributor`: You can create your own info contributor to expose any custom information you want.

To know more about autoconfigured info contributors, refer
to [Auto-configured InfoContributors](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.info.auto-configured-info-contributors)

### Environment Info Contributor

You can expose `info.*` environment properties by enabling Environment Info Contributor in your `application.properties`
or`application.yml` file.

```yaml
management:
  endpoint:
    info:
      env:
        enabled: true
# properties start with info. added to the info endpoint
info:
  encoding: UTF-8
  source: 17
  target: 17
```

Now, when you access the `/info` endpoint, you’ll see the additional information:

```json
{
  "encoding": "UTF-8",
  "source": "17",
  "target": "17"
}
```

### Writing Custom InfoContributors

To create a custom info contributor, you need to implement the `InfoContributor` interface. This interface requires you
to implement the `contribute()` method, which takes an `Info.Builder` object as a parameter. You can use this builder
to add key-value pairs of information to the `Info` object.

Here’s an example of a custom info contributor that adds application-specific information:

```java
import org.springframework.boot.actuate.info.Info;
import org.springframework.boot.actuate.info.InfoContributor;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class MyInfoContributor implements InfoContributor {

    @Override
    public void contribute(Info.Builder builder) {
        builder.withDetail("example", Collections.singletonMap("key", "value"));
    }

}
```

Now, when you access the `/info` endpoint, you’ll see the additional information:

```json
{
  "example": {
    "key": "value"
  }
}
```

To know more about Information Contributors, refer
to [Application Information](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.info)

## Best Practices

- **Security**: Always secure your actuator endpoints, especially `/health` and `/info`. Use Spring Security to
  restrict access to these endpoints.
- **Granularity**: Be careful about the level of detail you expose it. While it’s good to have detailed health checks,
  you don’t want to expose sensitive information.
- **Monitoring**: Use monitoring tools like Prometheus or Grafana to visualize the data from your actuator endpoints.
- **Focus on business-critical components**: Don’t just monitor the database or disk space—include health checks for
  services your app depends on to function, like payment providers, licensing APIs, or background schedulers.
- **Avoid false negatives**: External APIs might have temporary hiccups. Use timeouts, circuit breakers, and thresholds
  to avoid reporting the entire app as “DOWN” for a minor or transient issue.
- **Group health checks**:Use health groups to separate infrastructure checks (infra), external APIs (external), and
  application logic (core) for cleaner diagnostics.
- **Versioning**: Use the `/info` endpoint to track the version of your application. This is especially useful for
  debugging and support.
- **Keep checks lightweight**: Health checks should respond quickly. Avoid long-running calls or expensive database
  queries.
- **Use withDetail() wisely**: Add helpful details in responses—but don’t expose internal logic or error stack traces in
  production.

## Conclusion

Spring Boot Actuator isn’t just about exposing endpoints — it’s about gaining visibility into your application’s health
and behavior.

By customizing health checks and info contributors, you turn basic metrics into meaningful insights. When used well,
these tools help you detect issues early, track deployments confidently, and support your team with real-time
diagnostics.

**Invest a bit in observability now — and save hours in production later.**

## References

- [Spring Boot Actuator Documentation](https://docs.spring.io/spring-boot/reference/actuator/index.html)

