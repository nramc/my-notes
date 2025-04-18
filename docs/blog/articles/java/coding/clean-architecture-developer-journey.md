---
title: "Pragmatic Clean Architecture: A Developer's Journey Beyond Theory"
description: "Discover how we applied pragmatic Clean Architecture in real-world projects — balancing theory with practical solutions for scalable, maintainable systems."
author: Ramachandran Nellaiyappan
date:
  created: 2025-04-18
categories:
  - Java
tags:
  - Java
  - Clean Code
  - Latest
links:
  - "[Author] Ram": https://nramc.github.io/my-profile/
---

# Pragmatic Clean Architecture: A Developer's Journey Beyond Theory

**TL;DR**: Clean Architecture offers powerful principles for building modular, testable systems — but applying it in
real-world projects requires balance.

This article highlights common pitfalls like over-abstraction, complex layering, and over engineering — and shows how to
avoid them by staying pragmatic.

## Introduction

In the world of software development, Clean Architecture is often discussed in theoretical terms. However, the real
challenge lies in applying these principles to actual projects. This article aims to bridge that gap by providing
practical insights into implementing Clean Architecture from our real time experience in java springboot application.

## Understanding Clean Architecture

Clean Architecture is a software design philosophy that emphasizes separation of concerns, testability, and
maintainability. The core idea is to structure your code in a way that allows for easy changes and adaptations without
affecting the entire system.

The architecture is typically divided into layers, each with its own responsibilities:

- **Entities**: The core business logic and data structures.
- **Use Cases**: Application-specific logic — what the system does.
- **Interface Adapters**: Bridges between the core and the outside world (e.g., controllers, presenters, mappers).
- **Frameworks and Drivers**: External stuff like databases, UI, messaging systems, etc.

A key rule: **dependencies point inward**. Outer layers (like web controllers or repositories) can depend on inner
layers (like use cases), but never the other way around.

To know more about Clean Architecture, you can refer to
the [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) by Robert C.
Martin.

## Clean Architecture: Theory Meets Reality

### The Ideal World: Clean Architecture

Clean Architecture gives us a great mental model for building systems that are straightforward to maintain, adapt, and test —
especially as complexity grows.

The idea sounds awesome on paper:

- **Clear separation of concerns** – each layer (like controllers, business logic, and infrastructure) has its own job
  and doesn't step on others' toes.
- **Core logic knows nothing about frameworks** – your real business rules don’t depend on Spring, databases, or HTTP.
- **Easy to test** – you can test your core logic without spinning up a database or web server.
- **Modular and flexible** – adding features or swapping technologies doesn’t mean ripping things apart.

It’s all about making change less painful — so when the business shifts, your architecture doesn’t collapse.

### The Reality: What Actually Happens in Real Projects

Clean Architecture sounds great in theory, but once you're deep into a real codebase with fast changing requirements,
business pressure and deadlines, things get messy.

Here’s what we’ve actually experienced:

**Time & Resources vs. Architectural Purity**

**Ideal**: Clean Architecture advocates for careful, thoughtful design that takes into account scalability and long-term
maintainability.

**Reality**: In a real project, time-to-market is critical. You have two weeks to ship a feature, and writing five
layers of interfaces just to save a user to the database feels like overkill. Clean Architecture needs upfront time —
time to define interfaces, structure packages, and set up layers. That’s hard to justify when the business wants result
yesterday.

**Constantly Changing Requirements**

**Ideal**: Clean Architecture is meant to make change easier — and it does, eventually.

**Reality**: Business requirements often change rapidly, and systems need to be adaptable. However, adhering strictly to
Clean Architecture’s guidelines can sometimes make such changes difficult and time-consuming.

**Complexity of Over-Abstraction**

**Ideal**: Each layer in Clean Architecture serves a specific purpose, ensuring clear responsibilities and reducing
dependencies between components.

**Reality**: The ideal of having separate abstractions for each layer often leads to over-engineering.
E.g., For simple CRUD operations, going full Clean Arch can turn a 10-line service into 5 classes spread across 3
packages. That might be okay for critical flows, but for basic features, it just feels like ceremony. We’ve learned to
apply structure where it adds value — and skip it where it doesn’t.

**Team Dynamics and Experience Matter**

**Ideal**: With a well-structured, modular system, each team member can focus on a specific layer of the architecture.
This clear structure helps in scaling the team and the project.

**Reality**: The complexity of Clean Architecture can be overwhelming, particularly for teams with limited experience in
architectural design. While the theory assumes a well-coordinated, highly skilled team, in practice, the learning curve
can slow down development, especially if the team isn't already familiar with the pattern.

**Simplicity Beats Purity (Most of the Time)**

**Ideal**: Clean Architecture emphasizes modularity and separation, providing a clean, well-organized codebase where
each component does only one thing.

**Reality**: When the problem is small — like a CRUD API — forcing it into the full Clean Architecture, mold can make
the code harder to work with, not easier. We try to ask: “Is this layer really adding clarity?” If not, we don’t build
it.

**When Frameworks Already Do the Job**

**Ideal**: Clean Architecture emphasizes decoupling the business logic from the infrastructure (e.g., databases,
frameworks). This makes it easy to swap out technologies without affecting the core functionality.

**Reality**: Spring already gives us a lot: dependency injection, configuration, transactional boundaries, etc.
Sometimes Clean Architecture wants us to re-abstract things that Spring already handles well. In those cases, we’ve
learned to lean into the framework — not fight it. **No need to reinvent the wheel just for purity’s sake.**

## A Practical Middle Ground: What Actually Worked for Us

Perfect Clean Architecture looks great in diagrams — but codebases aren’t built on diagrams. In real projects, we rarely
have the luxury to build every abstraction upfront, and frankly, we don’t need to. The key is knowing when structure
helps, and when it just gets in the way.

Here’s what worked for us.

### Our Journey: From Hexagonal to Clean Architecture

We started with **Hexagonal Architecture** because it offered a straightforward way to isolate the core domain from
external systems like databases, APIs, and messaging. It worked well for us in the early stages—especially when the
domain was simple and small.

But as the business logic expanded, things got tricky. Features grew, boundaries between components blurred, and
cross-cutting concerns started leaking into places they didn’t belong. The core wasn’t as clean as we thought, and the
structure became harder to reason about.

At that point, we decided to shift toward Clean Architecture. Its layered approach gave us better control over
dependency flow and helped us manage growing complexity more systematically. It also allowed us to define clearer
contracts between layers, which became critical as the team and codebase scaled.

### Start Simple, Evolve Intentionally

We didn’t try to enforce all the layers or abstractions from day one.

Instead, we started simple — just enough structure to keep things organized. As complexity grew (new business rules,
shared logic, integrations), we added layers only where they brought value. If something was straightforward, we kept it
that way.

In our experience, **architecture should evolve with the problem**, not race ahead of it.

### What We Learned

At the end of the day, here’s what really matters when applying Clean Architecture in a real-world project:

- **Delivery > Purity**: Shipping working software matters more than perfectly layered code. Architecture should enable
  delivery — not block it.
- **Evolve the Design**: Start simple. Add structure only when the domain or complexity truly demands it. Don’t
  front-load abstractions you might never need.
- **Be Pragmatic**: Fit the architecture to the project — not the other way around. Every rule is bendable if it makes
  the system easier to work with.
- **Keep the Business Domain Front and Center**: Structure your code around what the business actually needs. When the
  domain leads, the rest of the system tends to follow naturally.
- **Avoid Gold Plating**: Don’t build layers or abstractions “just in case.” Stick to what delivers value now — you can
  always refactor later.
- **Use Dependency Injection**: Decoupling helps — especially when testing or swapping components. We let the
  framework (like Spring) do the heavy lifting here.
- **Respect the Dependency Rule**: Core logic shouldn’t depend on external stuff. Keep dependencies pointing inwards,
  and let the outer layers handle frameworks, DBs, and the web.
- **Refactor as You Grow**: Architecture isn’t a one-time decision. Make time to revisit and clean things up as the
  codebase evolves.
- **Learn from Experience**: Continuously learn from your experiences and adapt your approach as needed. Don’t expect
  perfection — just aim for progress.
- **Use Tools Wisely**: Leverage tools and frameworks that can help you implement Clean Architecture effectively. Tools
  like ArchUnit are great to enforce the rules you care about.

### Real-World Implementation: Lessons from our codebase

Here’s a simplified version of our project structure, which reflects our approach to Clean Architecture:

```plaintext
my-project
└── src
    └── main
        ├── asciidoc                         # Docs (e.g., system design, API docs)
        └── java
            └── com.github.nramc.base        
                ├── config                   # Configuration classes (e.g., Spring configuration, application setup)
                ├── core                     # Core domain and application logic
                │   ├── application          # Application layer, orchestrates use cases and business logic
                │   ├── domain               # Core business domain logic
                │   │   ├── model            # Domain models or entities (e.g., User, Order)
                │   │   └── service          # Domain services that encapsulate business logic
                │   ├── exception            # Custom exception classes for error handling
                │   ├── provider             # Wrappers for system/external services
                │   ├── usecase              # Use cases or application services (e.g., CreateUserUseCase)
                │   ├── util                 # Core Utility classes (e.g., helper methods, common functionality)
                │   └── validator            # Validator classes (e.g., business rule validations)
                │       └── impl             # Implementations of validation logic
                ├── gateway                  # External gateways or integrations with third-party systems
                ├── repository               # Repository interfaces and implementations for data access
                │   ├── converter            # Classes to convert between domain models and database models
                │   ├── impl                 # Implementations of repository interfaces (e.g., JPA repository)
                │   ├── projection           # Projection classes for database queries (e.g., DTOs for queries)
                ├── util                     # Additional utility classes that don’t fit into `core.util`
                ├── web                      # Web layer: Controllers, request handling, and web-specific logic
                │   ├── exception            # Web-specific exceptions (e.g., HTTP error handling)
                │   ├── interceptor          # Interceptors for request/response modification (e.g., logging, security)
                │   └── resource             # Resource classes for exposing APIs (e.g., REST controllers)
                └── MySpringBootApplication.java     # Main entry point of the Spring Boot application

```

!!! note "Note"

    This is how our structure evolved — not a one-size-fits-all. It reflects our balance between clean architecture principles and real-world constraints. The key is to keep responsibilities clear, enforce boundaries where they matter, and stay flexible enough to adapt as the system grows.

### What Helped: Lightweight ArchUnit Rules

To avoid architecture drift, we added ArchUnit tests to enforce a few key boundaries. Nothing too fancy — just enough
guardrails to catch accidental coupling early.

These checks live in our test suite and help the team stay aligned without needing to do architecture reviews every
week.

```java
package com.github.nramc.dev.journey.api;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.lang.ArchRule;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

class CleanArchitectureTest {
    private final JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(new ImportOption.DoNotIncludeTests())
            .importPackages("com.github.nramc");

    @Test
    void coreShouldNotDependOnWebOrRepositoryOrGateway() {
        ArchRule rule = noClasses()
                .that().resideInAnyPackage("..core..")
                .should().dependOnClassesThat()
                .resideInAnyPackage("..web..", "..repository..", "..gateway..", "..util..", "..config..");

        rule.check(importedClasses);
    }

    @Test
    void domainShouldNotDependOnOtherPackages() {
        ArchRule rule = noClasses()
                .that().resideInAPackage("..core.domain..")
                .should().dependOnClassesThat()
                .resideInAnyPackage(
                        "..core.application..",
                        "..core.usecase..",
                        "..repository..",
                        "..gateway..",
                        "..web.."
                );

        rule.check(importedClasses);
    }

    @Test
    void useCasesShouldNotDependOnWebOrRepositoryOrGateway() {
        ArchRule rule = noClasses()
                .that().resideInAnyPackage("..core.usecase..", "..core.application..")
                .should().dependOnClassesThat()
                .resideInAnyPackage("..web..", "..repository..", "..gateway..");

        rule.check(importedClasses);
    }

    @Test
    void configShouldNotBeDependedOn() {
        ArchRule rule = noClasses()
                .that().resideOutsideOfPackage("..config..")
                .should().dependOnClassesThat()
                .resideInAnyPackage("..config..");

        rule.check(importedClasses);
    }

    @Test
    void gatewayShouldOnlyBeAccessedByConfigAndGatewayItself() {
        ArchRule rule = noClasses()
                .that().resideOutsideOfPackages("..config..", "..gateway..")
                .should().dependOnClassesThat()
                .resideInAnyPackage("..gateway..");

        rule.check(importedClasses);
    }

    @Test
    void webShouldNotAccessRepositoryDirectly() {
        ArchRule rule = noClasses()
                .that().resideInAPackage("..web..")
                .should().dependOnClassesThat()
                .resideInAnyPackage("..repository..");

        rule.check(importedClasses);
    }

    @Test
    void webShouldOnlyBeAccessedByConfigAndItself() {
        ArchRule rule = noClasses()
                .that().resideOutsideOfPackages("..config..", "..web..")
                .should().dependOnClassesThat()
                .resideInAnyPackage("..web..");

        rule.check(importedClasses);
    }

    @Test
    void utilShouldNotDependOnOtherPackages() {
        ArchRule rule = classes()
                .that().resideInAPackage("..util..")
                .should().onlyDependOnClassesThat().
                resideOutsideOfPackages("..web..", "..gateway..", "..service..", "..repository..", "..usecase..");

        rule.check(importedClasses);
    }

    @Test
    void projectShouldNotHaveCyclicDependency() {
        SliceRule sliceRule = slices().matching("com.github.nramc.(*)..").should().beFreeOfCycles();
        sliceRule.check(importedClasses);
    }
}

```

!!! note "Note"

    Focus on enforcing the boundaries that **matter** most — not every theoretical rule. ArchUnit works best when it protects
    the essence of your structure, not every detail.

!!! tip "JUnit5 @ArchTest"

    With JUnit5, you can use the `@ArchTest` annotation too to run the ArchUnit rules as part of your test suite.
    This allows you to enforce architectural rules without writing separate test method.
    [ArchUnit: JUnit 5 Support](https://www.archunit.org/userguide/html/000_Index.html#_junit_5)

## Conclusion

Clean Architecture is a powerful tool for building maintainable and testable software. However, it is essential to apply
these principles pragmatically and adapt them to the needs of your project. By focusing on the business domain, avoiding
over-engineering, and following best practices, you can create a clean and effective architecture that meets the needs
of your team and your business.

> Clean Architecture is a direction, not a destination.

## References

- [The Clean Architecture by Robert C. Martin (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [A quick introduction to clean architecture](https://www.freecodecamp.org/news/a-quick-introduction-to-clean-architecture-990c014448d2/)
- [:fontawesome-brands-youtube: Anatomy of a Spring Boot App with Clean Architecture by Steve Pember @ Spring I/O 2023](https://www.youtube.com/watch?v=mbNzUkNjrnA)
