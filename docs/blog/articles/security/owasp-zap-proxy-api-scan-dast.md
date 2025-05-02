---
title: "Automating Security Testing in CI/CD Pipelines with OWASP ZAP: A Comprehensive Guide"
description: "Automate Dynamic Application Security Testing (DAST) with OWASP ZAP "
author: Ramachandran Nellaiyappan
date:
  created: 2025-04-21
categories:
  - Security
tags:
  - Automation
  - CI/CD
  - Maven
  - Testing
  - Secure Coding
  - Security Testing
  - Spring Boot
links:
  - "[Author] Ram": https://nramc.github.io/my-profile/
---

# Automating Security Testing in CI/CD Pipelines with OWASP ZAP: A Comprehensive Guide

## Introduction

Security is a critical aspect of software development, and it is essential to ensure that applications are secure
before they are deployed to production. Security testing can be performed using various tools and techniques, including
Static Code Analysis, Dynamic Application Security Testing(DAST), and penetration testing.
Each of these methods has its strengths and weaknesses, and the best approach is to use a combination of them to achieve
comprehensive security coverage.

We will focus on **Dynamic Application Security Testing(DAST)**, which is a type of security testing that involves
testing a **running application** for vulnerabilities. DAST tools simulate attacks on the application to identify
security weaknesses and provide recommendations for remediation.

But DAST tools can be complex to set up and configure, and they often require a deep understanding of the application
being tested. This is where the **OWASP ZAP Automation Framework**comes in. The ZAP Automation Framework is a powerful
tool that allows you to **automate** the security testing process using YAML files called scan plans.

In this article, We will explore how to
use [OWASP ZAP Automation Framework](https://www.zaproxy.org/docs/automate/automation-framework/)
to perform a shift left security testing on SpringBoot REST API with OpenAPI documentation. We will
use [Journey API](https://github.com/nramc/journey-api.git) to demonstrate the process.

### What is OWASP ZAP?

[OWASP ZAP (Zed Attack Proxy)](https://www.zaproxy.org/) is a popular open-source web application security scanner. It
is designed to find vulnerabilities in web applications during the development and testing phases. ZAP can be used for
both manual and automated security testing, making it the best tool for developers and security professionals.

### What is ZAP Automation Framework?

[ZAP Automation Framework](https://www.zaproxy.org/docs/automate/automation-framework/) is a powerful tool that allows
you to automate the security testing process using YAML files called **scan plans**. These scan plans define the steps
to be performed during the security testing process such as authentication, session management, scanning and generating
reporting. The scan plans can be customized to include specific tests, configurations, and parameters, allowing you to
tailor the security testing process to your specific needs.

!!! warning "Note"

    ZAP also provides various other options to automate the security testing process, you can refer to
    the [ZAP Automation Guide](https://www.zaproxy.org/docs/getting-further/automation/automation-options/).
    As per **OWASP team recommendation**, The Automation Framework will **in time replace** the Command Line and
    Packaged Scan options. Therefore it is important to start using the Automation Framework for security testing.

## Security Testing with OWASP ZAP Automation Framework

In this section, we will explore how to use the ZAP Automation Framework to perform security testing on a SpringBoot
REST API with OpenAPI documentation.
We will cover the following topics:

1. Setting up OWASP ZAP
2. Creating a scan plan
3. Running the scan plan
4. Review generated reports

### Prerequisites

- Running REST API Service - [SpringBoot](https://spring.io/projects/spring-boot)
- OpenAPI documentation available for the API - [Spring RestDoc](https://spring.io/projects/spring-restdocs)

### Step 1: Install OWASP ZAP

To get started with OWASP ZAP, you need to install it on your local machine. ZAP is available for Windows, macOS, and
Linux. The easiest way to install ZAP is to download the executable file for your operating system and run the
installer.

You can download the latest version of ZAP from the [OWASP ZAP website](https://www.zaproxy.org/download/).

### Step 2: Create a Scan Plan

The scan plan is a powerful feature of the ZAP Automation Framework that allows you to customize the security testing
process to meet your specific needs. You can define the steps to be performed during the security testing process, such
as authentication, session management, scanning, and generating reports. The scan plan can be customized to include
specific tests, configurations, and parameters, allowing you to tailor the security testing process to your specific
needs.

The scan plan is defined in a YAML file, which is a human-readable format that is easy to understand and modify. The
YAML file contains a series of jobs that perform specific tasks during the security testing process.
The jobs are executed in the order they are defined in the YAML file.

Our scan plan includes the following types of jobs:

- **passiveScan-config**: This job configures the passive scan settings for the ZAP instance. It allows you to specify
  which passive scan rules to enable or disable, as well as other configuration options.
- **openapi**: This job configures the OpenAPI settings for the ZAP instance. It allows you to specify the OpenAPI URL
  and other configuration options such as Authentication URL, Target API URL.
- **passiveScan-wait**: This job waits for the passive scan to complete before proceeding to the next job. It ensures
  that all passive scan rules have been executed and that the results are available for review.
- **activeScan**: This job performs an active scan on the target application. It simulates attacks on the application to
  identify vulnerabilities and provides recommendations for remediation.
- **report**: This job generates a report of the scan results. The report includes information about the vulnerabilities
  found during the scan, as well as recommendations for remediation.

We will use the ZAP GUI to create the scan plan. The ZAP GUI provides a user-friendly interface for creating and
managing scan plans. You can use the GUI to define the steps to be performed during the security testing process, such
as authentication, session management, scanning, and generating reports. The GUI also provides a visual representation
of the scan plan, making it easy to understand and modify.

To create a scan plan using the ZAP GUI, follow these steps:
[![OWASP ZAP Automation Framework](https://img.youtube.com/vi/ipnRyzQ5EwM/0.jpg)](https://www.youtube.com/watch?v=ipnRyzQ5EwM)

Here is a scan plan for Journey SpringBoot REST API:

```yaml
env:
  contexts:
    - name: journey-api
      urls:
        - ${TARGET_APP_URL}
      includePaths:
        - "${TARGET_APP_URL}.*"
      authentication:
        method: json
        parameters:
          loginPageUrl: ${TARGET_APP_URL}/rest/guestLogin
          loginRequestUrl: ${TARGET_APP_URL}/rest/guestLogin
          loginRequestBody: "{\"username\":\"{%username%}\",\"password\":\"{%password%}\"\
          }"
        verification:
          method: response
          pollFrequency: 60
          pollUnits: requests
          pollUrl: ""
          pollPostData: ""
      sessionManagement:
        method: headers
        parameters:
          Authorization: "Bearer {%json:token%}"
      technology: { }
      structure: { }
      users:
        - name: journey-user
          credentials:
            username: ${APP_USERNAME}
            password: ${APP_PASSWORD}
  parameters: { }
  vars:
    REPORT_DIR: "zap-report"
    APP_USERNAME: "journey-test-user@journey.com"
    APP_PASSWORD: "Journey-Test@123"
    TARGET_APP_URL: "http://localhost:8080"
jobs:
  - type: passiveScan-config
    parameters: { }
  - type: openapi
    parameters:
      apiUrl: ${TARGET_APP_URL}/doc/openapi
      targetUrl: ${TARGET_APP_URL}
      context: journey-api
      user: journey-user
  - type: passiveScan-wait
    parameters: { }
  - type: activeScan
    parameters: { }
    policyDefinition: { }
  - type: report
    parameters:
      reportDir: ${REPORT_DIR}
      reportTitle: Security Testing Report
  - type: exitStatus
    parameters: { }


```

!!! note "Note"

    It is strongly recommend to use the latest version of ZAP GUI for creating the scan plan. You can use the ZAP GUI to
    create the scan plan and then save it as a YAML file. This will ensure that the scan plan is compatible with the
    latest version of ZAP and will work as expected.

### Step 3: Run the Scan Plan

To run the scan plan, as shown in the video, you can use ZAP GUI instance to open the plan and execute it.
Alternatively, execute the scan plan using the ZAP command line interface. The command line interface allows you to run
the scan plan in a headless mode, which is useful for automating the security testing process in a CI/CD pipeline.

To start the ZAP instance, you can use the following command:

```shell

sh /Applications/ZAP.app/Contents/MacOS/ZAP.sh -port 9010 -dir ${HOME}/Documents/owasp -cmd -autorun .github/workflows/zap/journey-dast-plan.yaml

```

- This command starts the ZAP instance and runs the scan plan defined in the `journey-dast-plan.yaml` file.
- The `-port` option specifies the port for ZAP instance to listen on. By default, ZAP uses port 8080.
- The `-dir` option specifies the directory where the ZAP instance will store its data.
- The `-cmd` option specifies the command to run the scan plan.
- The `-autorun` option specifies the YAML file that contains the scan plan to be executed.

You can find more information about the command line in
the [ZAP Command Line](https://www.zaproxy.org/docs/desktop/cmdline/).

### Step 4: Review the Reports

Scan report is generated in the `zap-report` directory which is mentioned in scan plan. The report includes information
about the vulnerabilities found during the scan, as well as recommendations for remediation. The report is generated in
HTML format by default, it can be configured to generate in different format if required.

The Above video shows the report generated by ZAP for the Journey API.

## Automate Security Testing in CI/CD

During development, a developer can install ZAP on their workstation and should be able to run Automation Framework's
plan, which tests locally to ensure that the code is secure before committing it to the repository.

But How do we ensure automatically that the code is secure? The answer is **integrated ZAP into the CI/CD pipeline**.

You can use [ZAP Docker Image](https://www.zaproxy.org/docs/docker/about/) to run the scan plan in the CI/CD pipeline.
Alternatively, you can use
the [ZAP Automation Framework GitHub Action](https://github.com/marketplace/actions/zap-automation-framework-scan) to
run the scan plan in the CI/CD pipeline. The GitHub Action under the hood uses the ZAP docker image to run the scan
plan.

Here is an example of how to use the ZAP Automation Framework in a GitHub Actions workflow:

```yaml
name: CI
on:
  push:
    branches:
      - main
  pull_request:
    types: [ opened, synchronize, reopened ]
jobs:
  security-test:
    name: Security Testing
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: Start application for Security Testing
        run: |
          mvn clean install -DskipTests # Optional: to resolve any project dependencies
          mvn spring-boot:start
        env:
          SPRING_PROFILES_ACTIVE: integration

      - name: Wait for application to start
        run: |
          timeout 60 bash -c 'until curl -s http://localhost:8080/actuator/health; do sleep 5; done'

      - name: ZAP Scan
        uses: zaproxy/action-af@v0.2.0
        with:
          plan: '.github/workflows/zap/journey-openapi-plan.yaml'
          cmd_options: '-port 8090'
          docker_env_vars: |
            REPORT_DIR
        env:
          REPORT_DIR: "/zap/wrk/zap-report"

      - name: Stop Spring Boot application
        run: |
          mvn spring-boot:stop

```

In this example,

- we are using the `actions/checkout@v4` and `actions/setup-java@v4` action to check out the code from the repository
  and set up the JDK 21 environment for the SpringBoot application.
- we are using the `mvn spring-boot:start` command to start the SpringBoot application for security testing with spring
  profile `integration`.
- we are using the `timeout` & 'curl' command to wait for the application to start before running the ZAP scan.
- we are using the `zaproxy/action-af` ZAP's GitHub Action to run the scan plan defined in the
  `.github/workflows/zap/journey-openapi-plan.yaml` file.
- The `cmd_options` option specifies the command line options to be passed to the ZAP instance. In this example, we are
  using the `-port 8090` option to change default port 8080, since the application uses port 8080.
- The `docker_env_vars` option specifies the environment variables to be passed to the ZAP instance.
- The `REPORT_DIR` environment variable specifies the directory where the ZAP instance will store its data.
- we are using the `mvn spring-boot:stop` command to stop the SpringBoot application after the ZAP scan is
  completed.

## Automate Security Testing with Staging Environment

In the above example, we are using the `mvn spring-boot:start` command to start the SpringBoot application in CI/CD
pipeline for security testing. But this is not enough since the application is isolated with mocks and test containers.
We need to run security testing with the application running on a staging environment that is similar to the
production-like environment.

To run the security testing with the application running on a staging environment, you can use the following steps:

1. Deploy the application to a staging environment using your CI/CD pipeline.
2. Update the `TARGET_APP_URL` environment variable in the scan plan to point to the staging environment URL.
3. Provide the required environment variables such as `APP_USERNAME` and `APP_PASSWORD` to the scan plan.
4. Run the ZAP scan using the ZAP Automation Framework GitHub Action or the ZAP command line interface.

Here is an example of nightly job to run the security testing with the application running on a staging environment:

```yaml
name: Nightly Security Testing
on:
  schedule:
    - cron: '0 0 * * *' # Every day at midnight
jobs:
  security-test:
    name: Security Testing
    runs-on: ubuntu-latest
    steps:

      - name: ZAP Scan
        uses: zaproxy/action-af@v0.2.0
        with:
          plan: '.github/workflows/zap/journey-openapi-plan.yaml'
          cmd_options: '-port 8090'
          docker_env_vars: |
            REPORT_DIR
        env:
          REPORT_DIR: "/zap/wrk/zap-report"
          TARGET_APP_URL: "https://journey-api-qa.com"
          APP_USERNAME: ${secrets.APP_USERNAME}
          APP_PASSWORD: ${secrets.APP_PASSWORD}

```

!!! tip "Tip"

    You can trigger the **nightly job automatically** from deployment workflow as soon as the application is deployed to the staging environment to get immediate feedback.

If you want to run manually the security testing with the application running on a staging environment using the ZAP
command line
interface, you can use the following command:

```shell
# set required environment variables
export REPORT_DIR="/zap-report"
export TARGET_APP_URL="https://journey-api-qa.com"
export APP_USERNAME="real-qa-test-user"
export APP_PASSWORD="real-qa-test-password"

sh /Applications/ZAP.app/Contents/MacOS/ZAP.sh -dir ${HOME}/Documents/owasp -cmd -autorun .github/workflows/zap/journey-dast-plan.yaml

```

## Real-World Lessons Learned

- **Shift Left Security Testing**: Incorporate security testing into the development process as early as possible to
  identify vulnerabilities before they reach production.
- **Use the latest version of ZAP**: The ZAP Automation Framework is constantly evolving, and it is important to use the
  latest version of ZAP to take advantage of the latest features and improvements.
- **Use the ZAP GUI to create the scan plan**: The ZAP GUI provides a user-friendly interface for creating and managing
  scan plans.
- **Fail Build on High Risk Vulnerabilities**: It is important to fail the build on high-risk vulnerabilities to ensure
  that the application is secure before it is deployed to production. You can use the `exitStatus` job in the scan plan
  to fail the build on high-risk vulnerabilities.
- **Use Environment-Specific Configurations**: Ensure scan plans are configured for different environments (e.g.,
  development, staging, production) to avoid false positives or missed vulnerabilities.
- **Upload the report to a central location**: It is important to upload the scan report to a central location for
  review and analysis. You can use the `report` job in the scan plan to generate the report and upload it to a central
  location.

## Conclusion

In this article, we explored how to use the OWASP ZAP Automation Framework to perform security testing on a SpringBoot
REST API with OpenAPI documentation. We also discussed how to integrate ZAP Automation Framework into your CI/CD
pipeline using GitHub Action.

By automating the security testing process, you can ensure that your applications are secure before they are deployed to
production. This will help you to identify and remediate security vulnerabilities early in the development process,
reducing the risk of security breaches and improving the overall security posture of your applications.

## References

- [OWASP ZAP Automation Framework](https://www.zaproxy.org/docs/automate/automation-framework/)
- [Automation Guide - Options](https://www.zaproxy.org/docs/getting-further/automation/automation-options/)
- [ADDO Workshop](https://www.zaproxy.org/addo-auth-workshop/)
- [GitHub Action:ZAP Automation Framework Scan](https://github.com/marketplace/actions/zap-automation-framework-scan)
- [Dynamic Application Security Testing (DAST)](https://owasp.org/www-project-devsecops-guideline/latest/02b-Dynamic-Application-Security-Testing)

