---
title: "Checklist for creating Java Application/Service"
description: "Ensure a smooth Java app launch with this checklist—setup, coding, testing, and deployment essentials!"
author: Ramachandran Nellaiyappan
date:
  created: 2024-10-28
  updated: 2025-04-18
categories:
  - Guideline
tags:
  - Application Checklist
  - Java
hide:
  - toc
links:
  - "[Author] Ram": https://nramc.github.io/my-profile/
---

# Checklist for creating Java Application/Service

This article outlines the essential steps and considerations for Creating a new Java Application or Service

- [x] [Spring Initializr](https://start.spring.io/) is a great tool for creating initial projects with predefined initial
  setup. I find it really helpful.
- [x] Set up a Sonar project for the repository.
  If it is an open source project,
  [Sonar Cloud](https://www.sonarsource.com/products/sonarcloud/) is really helpful for maintaining good quality code.
- [x] Setup Continues Integration (CI) workflow for each commit and merge request.
  Feel free to have a look:
  [Journey API | ci-build-workflow.yml](https://github.com/nramc/journey-api/blob/main/.github/workflows/ci-build-workflow.yml).
- [x] Setup Continues Deployment (CD) workflow for automated deployment to QA & LIVE environments.
- Feel free to have a look:[Journey API | release-workflow.yml](https://github.com/nramc/journey-api/blob/main/.github/workflows/release-workflow.yml)
- [x] [Docker Compose](https://docs.spring.io/spring-boot/how-to/docker-compose.html) really helps and boosts developer
  productivity and reduces the complexity of environment setup.
- [x] Containerization: Use Docker or other container solutions to package the application consistently. Feel free to
  have look [Journey API | Dockerfile](https://github.com/nramc/journey-api/blob/main/Dockerfile)
- [x] [Renovate Bot](https://docs.renovatebot.com/) integration really helps to automatically update dependencies. Feel
  free to have look [Journey API | renovate.json](https://github.com/nramc/journey-api/blob/main/renovate.json)
- [x] [OpenRewrite](https://docs.openrewrite.org/) integration is a really powerful tool to maintain good code quality and
  automated refactoring to reduce technical debt. Feel free to have
  look [Journey API | rewrite.yml](https://github.com/nramc/journey-api/blob/main/rewrite.yml)
- [x] [Open API with Swagger](https://swagger.io/docs/)/[Spring REST API Doc with AsciiDoc](https://docs.spring.io/spring-restdocs/docs/current/reference/htmlsingle/)
  Document the code and create developer-friendly API documentation. There are many other ways and frameworks to
  document API, but Personally I would recommend any of these two. Feel free to have
  look [Journey API Configuration](https://github.com/nramc/journey-api/blob/main/src/main/resources/application.yml) & [REST API Documentation](https://github.com/nramc/journey-api/tree/main?tab=readme-ov-file)
- [x] [Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/index.html) is a great
  tool to monitor and manage Spring Boot applications. It provides production-ready features such as metrics,
  health checks, and application environment information.
- [x] Integrate Micrometer with monitoring tools like Prometheus or Grafana to visualize general and application metrics.
- [x] Use [Flyway](https://flywaydb.org) or [Liquibase](https://www.liquibase.com/) for database migrations.
- [x] 
  Use [Spring Profiles](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-profile-registries)
  to manage different configurations for different environments (e.g., development, testing, production).
- [x] Follow [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
  principles to organize code. Use [ArchUnit](https://www.archunit.org/) to enforce architectural rules. Please refer
  the article to know more about pragmatic
  implementation: [Pragmatic Clean Architecture: A Developer's Journey Beyond Theory](https://nramc.github.io/my-notes/blog/clean-architecture-developer-journey.html)
- [x] 
  Use [Spring Boot DevTools] (https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.devtools)
  for
  development. It provides features like automatic restarts, live reload, and configurations for improved developer
  experience.
