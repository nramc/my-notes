---
title: todo
description: todo
author: Ramachandran Nellaiyappan
date:
  created: 2025-05-11
categories:
  - Secure Coding
tags:
  - Java
  - Secure Coding
  - Static Analysis
  - OpenRewrite
  - Security
  - Automation
links:
  - "[Author] Ram": https://nramc.github.io/my-profile/
---

# Checkstyle with OpenRewrite: todo

**TL;DR**: Checkstyle is a static code analysis tool that helps developers adhere to coding standards and best practices
in Java projects. It can be integrated with OpenRewrite to automate code style enforcement and improve code quality.
This document provides an overview of Checkstyle, its integration with OpenRewrite, and how to set up and customize
rules for your Java projects. It also covers creating custom rules, rule suppressions, and best practices for using
Checkstyle effectively.

## Introduction

In fast-moving development teams, maintaining **clean, consistent, and secure code** isn't just about writing better
code — it's about enforcing it automatically. Linters like **Checkstyle** help highlight violations of coding standards.

But here's the challenge many teams face: Checkstyle tells you what's wrong, but it doesn't fix it. Developers get the
warning, maybe even a failed build — but unless fixing it is frictionless, these issues often get pushed down the
backlog.

That's where combining [Checkstyle](https://checkstyle.sourceforge.io/) and [OpenRewrite](https://docs.openrewrite.org/)
becomes powerful.

This article walk through how to:

- Enforce consistent style and code quality with Checkstyle
- Use OpenRewrite to automatically refactor and fix code based on those rules
- Integrate both tools into your IDE, build system, and CI/CD pipeline
- Create custom rules to enforce your team's coding standards
- Suppress rules for specific cases without cluttering your codebase

This isn’t just theory — it's a practical approach grounded in real development workflows.

### Checkstyle

Checkstyle is a static code analysis tool for Java that helps developers follow coding standards by checking source code
against a defined set of rules.

It's widely used to:

- Enforce formatting (indentation, import order, braces)
- Catch common mistakes (magic numbers, unused imports, redundant modifiers)
- Ensure code quality (Javadoc comments, naming conventions, cyclomatic complexity)
- Promote best practices (final variables, method length, class design)
- Detect potential bugs (null checks, exception handling, resource management)
- Encourage consistency (line length, whitespace, naming conventions)
- Facilitate code reviews (automated checks, reporting, integration with CI/CD)

### OpenRewrite

[OpenRewrite](https://docs.openrewrite.org/) is a powerful-automated refactoring tool for Java (and other JVM languages)
that analyzes source code using an Abstract Syntax Tree (AST) and applies safe, opinionated transformations.

Unlike linters, it doesn't just tell you what’s wrong — it actually **rewrites your code** for you.

It excels at:

- Refactoring large codebases (e.g., migrating to new libraries, updating APIs)
- Enforcing best practices (like enforcing logging standards, removing unused code)
- Updating dependencies (like changing package names, updating method calls)
- Enforcing security standards (like removing deprecated APIs, updating to secure libraries)
- Fixing code smells (like simplifying complex expressions, removing redundant code)
- Integrating with CI/CD pipelines (like running checks and applying fixes automatically)

OpenRewrite bridges the gap between code quality **enforcement and automation**.

### Checkstyle with OpenRewrite

While **Checkstyle flags violations** and **OpenRewrite fixes code**, the real magic happens when you combine them
strategically.

Imagine this workflow:

- Define your code style rules in `checkstyle.xml`
- Run Checkstyle during development and CI to detect violations
- Use OpenRewrite recipes to automatically fix those violations
- Automate both steps in your CI pipeline to ensure code is clean, consistent, and secure before merge

**This creates a fast feedback loop**: developers are warned about issues early, and those issues can be automatically
corrected — reducing friction, manual fixes, and code review overhead.

## Getting Started

Before jumping into automated code cleanup and refactoring, let’s get both tools — Checkstyle and OpenRewrite — up and
running in your project.

### Prerequisites

Make sure your development environment includes the following:

- Java installed - version 21 or higher
- Maven or Gradle build tool
- IDE (e.g., IntelliJ IDEA, Eclipse)

### Setup Style Guide

Checkstyle works based on a set of predefined or custom rules.

Two popular Java style guides are available out of the box:

[Google Java Style Guide](https://github.com/checkstyle/checkstyle/blob/master/src/main/resources/google_checks.xml)
[Sun(Oracle) Java Style Guide](https://github.com/checkstyle/checkstyle/blob/master/src/main/resources/sun_checks.xml)

You can use either of these as a starting point for your Checkstyle configuration.
You can also create your own custom rules by defining them in an XML file.

!!! tip "Checkstyle Configuration"

    Checkstyle configuration is typically done in an XML file named `checkstyle.xml` and Store the file under
    `config/checkstyle/checkstyle.xml` to keep things organized.

### Setup Checkstyle

Add the Checkstyle dependency to your `pom.xml` file.

```xml

<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-checkstyle-plugin</artifactId>
    <version>${maven-checkstyle-plugin.version}</version>
    <configuration>
        <configLocation>config/checkstyle/checkstyle.xml</configLocation>
    </configuration>
    <dependencies>
        <dependency>
            <groupId>com.puppycrawl.tools</groupId>
            <artifactId>checkstyle</artifactId>
            <version>${checkstyle.version}</version>
        </dependency>
    </dependencies>
    <executions>
        <execution>
            <id>verify</id>
            <phase>verify</phase>
            <goals>
                <goal>check</goal>
            </goals>
        </execution>
    </executions>
</plugin>
   ```

### Setup OpenRewrite

Add the OpenRewrite plugin to your pom.xml:

```xml

<plugin>
    <groupId>org.openrewrite.maven</groupId>
    <artifactId>rewrite-maven-plugin</artifactId>
    <version>${rewrite-maven-plugin.version}</version>
    <executions>
        <execution>
            <id>run-open-rewrite-execution</id>
            <goals>
                <goal>runNoFork</goal>
            </goals>
            <phase>process-sources</phase>
        </execution>
    </executions>
    <configuration>
        <activeRecipes>
            <recipe>com.github.nramc.recipes.sources</recipe>
            <recipe>com.github.nramc.recipes.testing</recipe>
        </activeRecipes>
    </configuration>
    <dependencies>
        <!-- plugin dependencies -->
    </dependencies>
</plugin>
```

!!! warning "OpenRewrite Configuration"

    OpenRewrite plugin should be configured to run before Checkstyle in the Maven build lifecycle. This ensures that
    any code style violations detected by Checkstyle are based on the latest code changes made by OpenRewrite.
    This is important since OpenRewrite may modify the code in a way that could affect Checkstyle's analysis.

!!! tip "OpenRewrite Configuration"

    We have created detailed dedicated documentation for OpenRewrite Integration. Please refer to the
    [OpenRewrite Integration](https://nramc.github.io/my-notes/blog/open-rewrite.html) for more information.

### Run Checkstyle and OpenRewrite

Run Checkstyle:

```shell
mvn checkstyle:check
```

This will check your code against the rules defined in your `checkstyle.xml` file.
If there are any violations, Checkstyle will report them in the console output.

Run OpenRewrite:

```shell
mvn rewrite:run
```

This will apply the OpenRewrite recipes defined in your `pom.xml` file to your codebase.

### Recommended Workflow

1. Run Checkstyle first to identify violations
2. Run OpenRewrite to automatically fix what it can
3. Re-run Checkstyle to confirm cleanup
4. Review any remaining violations
5. Make manual fixes as needed
6. Commit the changes with confidence

## Tooling & Plugin

### Maven Plugin

```shell
mvn checkstyle:check
mvn checkstyle:checkstyle
```

### IntelliJ IDEA

### Checkstyle IDE Plugin

## CI/CD Integration

## Rules configuration

Example of all Checks/Modules usage could be found at checkstyle's code convention at
file [checkstyle-checks.xml](https://github.com/checkstyle/checkstyle/blob/master/config/checkstyle-checks.xml)

## Creating custom rules

Option 1: Use Built-in Modules with Custom Configuration
This is the simplest and most common form of customization. You configure an existing Checkstyle module (rule) in your
checkstyle.xml.

Example: Enforce class Javadoc only on public classes

```xml

<module name="JavadocType">
    <property name="scope" value="public"/>
    <property name="allowMissingJavadoc" value="false"/>
</module>
```

You can combine multiple modules and properties to build powerful custom rules.

Option 2: Use Open Source Community Modules
Checkstyle has a number of open source community modules that you can use to extend the built-in rules. These modules
are not part of the core Checkstyle distribution, but they are available for download and use.
You can find these modules on the Checkstyle GitHub repository or other open source repositories.

Option 3: Write Your Own Custom Module
If you need a rule that is not available in the built-in modules or community modules, you can write your own custom
module. This is the most complex option, but it gives you the most flexibility and control over your code quality
checks.
To write a custom module, you need to implement the Checkstyle API and define the logic for your rule. This requires
knowledge of Java programming and the Checkstyle API.

```java
package com.yourcompany.checkstyle;

import com.puppycrawl.tools.checkstyle.api.*;

public class MyCustomRule extends AbstractCheck {
    private static final String MSG = "Class name must start with 'My'.";

    @Override
    public int[] getDefaultTokens() {
        return new int[]{TokenTypes.CLASS_DEF};
    }

    @Override
    public void visitToken(DetailAST ast) {
        String className = ast.findFirstToken(TokenTypes.IDENT).getText();
        if (!className.startsWith("My")) {
            log(ast.getLineNo(), MSG);
        }
    }
}

```

Update your checkstyle.xml to include your custom module:

```xml

<module name="com.myproject.checkstyle.MyCustomCheck"/>
```

!!! tip "Reusable Rules"

    If your project is multi-module or you want to reuse the rule across multiple services, it's better to isolate it in a
    reusable module and publish it to a Maven repository. This way, you can easily manage dependencies and updates.

## Rule suppressions

### Suppressions by annotation

[SuppressWarningsFilter](https://checkstyle.sourceforge.io/filters/suppresswarningsfilter.html)

### Suppressions by comment

[SuppressionCommentFilter](https://checkstyle.sourceforge.io/filters/suppressioncommentfilter.html)

```java
//CHECKSTYLE:OFF
int VAR2; // filtered violation 'must match pattern'
//CHECKSTYLE:ON
```

### Suppressions by xml

[SuppressionFilter](https://checkstyle.sourceforge.io/filters/suppressionfilter.html)

```xml

<module name="SuppressionFilter">
    <property name="file" value="config/suppressions.xml"/>
    <property name="optional" value="false"/>
</module>
```

```xml
<?xml version="1.0"?>

<!DOCTYPE suppressions PUBLIC
        "-//Checkstyle//DTD SuppressionFilter Configuration 1.2//EN"
        "https://checkstyle.org/dtds/suppressions_1_2.dtd">

<suppressions>
    <suppress checks="JavadocStyleCheck"
              files="AbstractComplexityCheck.java"
              lines="82,108-122"/>
    <suppress checks="MagicNumberCheck"
              files="JavadocStyleCheck.java"
              lines="221"/>
    <suppress message="Missing a Javadoc comment"/>
</suppressions>
```

## Best Practices

- make use of `metadata` tags
- make use of `message` tags for custom rules to provide more context:
  `<message key="name.invalidPattern" value="Member ''{0}'' must start with a lowercase ''m'' (checked pattern ''{1}'')."/>`
-

## Conclusion

## References

- [checkstyle-checks.xml](https://github.com/checkstyle/checkstyle/blob/master/config/checkstyle-checks.xml)
- [Google Java Style Guide](https://github.com/checkstyle/checkstyle/blob/master/src/main/resources/google_checks.xml)
- [Sun(Oracle) Java Style Guide](https://github.com/checkstyle/checkstyle/blob/master/src/main/resources/sun_checks.xml)

