---
title: "Checklist for creating Java Application/Service"
description: "Ensure a smooth Java app launch with this checklist—setup, coding, testing, and deployment essentials!"
author: Ramachandran Nellaiyappan
date: 2024-10-28
updated: 
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

- [x] [Spring Initializr](https://start.spring.io/) is great tool for creating initial projects with predefined initial
  setup. I find it really helpful.
- [x] Set up Sonar project for the repository. If it is open source
  project, [Sonar Cloud](https://www.sonarsource.com/products/sonarcloud/) is really helpful for maintaining good
  quality code
- [x] Setup Continues Integration(CI) workflow for each commit and merge request. Feel free to have
  look: [Journey API | ci-build-workflow.yml](https://github.com/nramc/journey-api/blob/main/.github/workflows/ci-build-workflow.yml)
- [x] Setup Continues Deployment(CD) workflow for automated deployment to QA & LIVE environments. Feel free to have
  look: [Journey API | release-workflow.yml](https://github.com/nramc/journey-api/blob/main/.github/workflows/release-workflow.yml)
- [x] [Docker Compose](https://docs.spring.io/spring-boot/how-to/docker-compose.html) really helps and boost developer
  productivity and reduce complexity for environment setup.
- [x] Containerization: Use Docker or other container solutions to package the application consistently. Feel free to
  have look [Journey API | Dockerfile](https://github.com/nramc/journey-api/blob/main/Dockerfile)
- [x] [Renovate Bot](https://docs.renovatebot.com/) integration really helps to automatically update dependencies. Feel
  free to have look [Journey API | renovate.json](https://github.com/nramc/journey-api/blob/main/renovate.json)
- [x] [OpenRewrite](https://docs.openrewrite.org/) integration really powerful tool to maintain good code quality and
  automated refactoring to reduce technical debt. Feel free to have
  look [Journey API | rewrite.yml](https://github.com/nramc/journey-api/blob/main/rewrite.yml)
- [x] [Open API with Swagger](https://swagger.io/docs/) Document the code and create developer-friendly API
  documentation. Personally I would recommend Open API Specification with Swagger UI. Feel free to have
  look [Journey API Configuration](https://github.com/nramc/journey-api/blob/main/src/main/resources/application.yml) & [REST API Documentation](https://github.com/nramc/journey-api/tree/main?tab=readme-ov-file)