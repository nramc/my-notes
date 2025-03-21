---
title: "Conditionally Registering JUnit 5 Extensions"
description: "Register JUnit 5 extensions based on runtime conditions, like Spring profiles or environment variables."
author: Ramachandran Nellaiyappan
date:
  created: 2025-03-21
categories:
  - Java
tags:
  - Java
  - Testing
  - Junit
links:
  - "[Author] Ram": https://nramc.github.io/my-profile/
---

# Conditionally Registering JUnit 5 Extensions

**TL;DR**: JUnit 5 extensions can be registered statically with @ExtendWith or dynamically with @RegisterExtension, but both have drawbacks. @ExtendWith applies extensions unconditionally, while @RegisterExtension requires manual instantiation and lacks centralized control. A conditional extension resolver enables dynamic registration based on Spring profiles, environment variables, or feature flags, keeping test setups clean and efficient. Using a custom annotation (@ExtendWithProfileCondition), extensions load only when needed, improving test flexibility and maintainability.

## Introduction

JUnit 5 provides a powerful extension model that allows developers to customize test execution. While extensions can be
registered globally using `@ExtendWith`, there are cases where you might want to conditionally register an extension
based on specific criteria, such as the active Spring profile, an environment variable, feature flags and so on.

In this article, we explore how to conditionally register JUnit 5 extensions dynamically, focusing on a reusable
approach that allows easy integration of any new conditions.

## Understanding JUnit 5 Extensions

JUnit 5 extensions allow custom behavior to be injected at different stages of test execution. Some common extension
interfaces include:

- `BeforeAllCallback` – Executed before **all** tests in a test **class**.
- `BeforeEachCallback` – Executed before **each** test **method**.
- `BeforeTestExecutionCallback` - Executed before **each** test **method** but after `BeforeEachCallback`.
- `AfterTestExecutionCallback` - Executed after **each** test **method** but before `AfterEachCallback`.
- `AfterEachCallback` – Executed after **each** test **method**.
- `AfterAllCallback` – Executed after **all** tests in a test **class**.

**Registering Extensions Using `@ExtendWith`**

By default, JUnit registers extensions using:

```java

@ExtendWith(MyExtension.class)
class MyTestClass {
    // continue with test methods
}
```

The `@ExtendWith` annotation is a **static** mechanism for registering extensions. It applies extensions *
*unconditionally**, meaning the extensions are always loaded and executed, regardless of the test execution context.
This can lead to:

- **Unnecessary resource consumption** if the extension is not always needed.
- **Inefficient Test execution** due to redundant extensions being loaded.
- **Reduced flexibility**, as conditions cannot be applied dynamically.

**Registering Extensions Using `@RegisterExtension`**

JUnit 5 also provides an alternative way to register extensions conditionally at run time using `@RegisterExtension`.
This allows more dynamic control over the extension lifecycle within the test class:

```java
class MyTest {
    @RegisterExtension
    static MyCustomExtension myCustomExtension = "true".equals(System.getenv("USE_CUSTOM_EXTENSION")) ? new MyCustomExtension() : MyCustomExtension.NO_OP;
    // continue with test methods
}
```

`@RegisterExtension` provides more flexibility by allowing extensions to be defined as instance variables, but it still
has limitations:

- While this approach works for simple conditions, it becomes problematic with more complex conditions, such as managing
  Spring profiles or feature toggles.
- The Conditions often require runtime evaluation, which cannot be easily handled at
  class initialization.
- Extensions are still **instantiated** even if they are not needed for a specific test execution.
- The logic for enabling/disabling extensions based on runtime conditions has to be implemented **within the test class
  **, leading to duplication across multiple test classes.

## Designing a Conditional Extension Resolver

To toggle the above-mentioned limitations, **custom solution** provides:

- **Dynamic extension registration** based on conditions.
- **Centralized logic**, keeping test classes clean.
- **Reusable condition evaluators**, making it easy to introduce new conditions (e.g., Spring profiles, environment
  variables, feature flags, system properties, so on.).

We can create a generic resolver that allows executing extensions conditionally based on the test context.

**Implement abstract conditional extension resolver**

We define an abstract conditional extension resolver that listens to JUnit lifecycle callbacks and delegates handling to
subclasses:

```java

public abstract class AbstractConditionalExtensionResolver implements BeforeAllCallback, BeforeEachCallback, BeforeTestExecutionCallback, AfterTestExecutionCallback, AfterEachCallback, AfterAllCallback {

    public abstract void handler(ExtensionContext context, Class<? extends Extension> callbackClass);

    @Override
    public void beforeAll(ExtensionContext context) {
        handler(context, BeforeAllCallback.class);
    }

    @Override
    public void beforeEach(ExtensionContext context) {
        handler(context, BeforeEachCallback.class);
    }

    @Override
    public void beforeTestExecution(ExtensionContext context) {
        handler(context, BeforeTestExecutionCallback.class);
    }

    @Override
    public void afterTestExecution(ExtensionContext context) {
        handler(context, AfterTestExecutionCallback.class);
    }

    @Override
    public void afterEach(ExtensionContext context) {
        handler(context, AfterEachCallback.class);
    }

    @Override
    public void afterAll(ExtensionContext context) {
        handler(context, AfterAllCallback.class);
    }

    protected void invokeExtensionsIfApplicable(ExtensionContext context, Class<? extends Extension>[] extensions, Class<? extends Extension> targetExtensionType) {
        Arrays.stream(extensions).filter(targetExtensionType::isAssignableFrom).forEach(extensionClass -> {
            try {
                Extension extensionInstance = extensionClass.getDeclaredConstructor().newInstance();
                switch (extensionInstance) {
                    case BeforeAllCallback callback -> callback.beforeAll(context);
                    case BeforeEachCallback callback -> callback.beforeEach(context);
                    case BeforeTestExecutionCallback callback -> callback.beforeTestExecution(context);
                    case AfterTestExecutionCallback callback -> callback.afterTestExecution(context);
                    case AfterEachCallback callback -> callback.afterEach(context);
                    case AfterAllCallback callback -> callback.afterAll(context);
                    default -> log.warn("Unsupported extension: {}", extensionClass);
                }
            } catch (Exception ex) {
                throw new RuntimeException("Failed to instantiate and invoke extension: " + extensionClass, ex);
            }
        });
    }

}

```

- The `handler()` method must be implemented by custom resolvers to evaluate conditions and register extensions
  dynamically.

## Resolver for Spring Profiles

**Define the conditional extension annotation**

```java

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
@ExtendWith(ExtendWithProfileConditionResolver.class)
public @interface ExtendWithProfileCondition {

    String[] profiles() default {};

    Class<? extends Extension>[] extensions() default {};
}
```

**Implement the Conditional Extension Resolver**

The resolver checks the specified conditions and applies the extensions if they match:

```java

@Slf4j
public class ExtendWithProfileConditionResolver extends AbstractConditionalExtensionResolver {

    @Override
    public void handler(ExtensionContext context, Class<? extends Extension> callbackClass) {
        Stream.of(context.getTestClass(), context.getTestMethod())
                .flatMap(Optional::stream)
                .map(element -> element.getAnnotation(ExtendWithProfileCondition.class))
                .filter(Objects::nonNull)
                .forEach(annotation -> evaluateConditionAndInvokeExtensions(context, annotation, callbackClass));
    }

    private void evaluateConditionAndInvokeExtensions(ExtensionContext context, ExtendWithProfileCondition extendWith, Class<? extends Extension> targetExtensionType) {
        if (evaluateCondition(context, extendWith)) {
            log.debug("Condition met for profile:[{}] Registering extensions:[{}]", Arrays.toString(extendWith.profiles()), extendWith.extensions());
            invokeExtensionsIfApplicable(context, extendWith.extensions(), targetExtensionType);
        } else {
            log.debug("Condition not met for profile:[{}]. Skipping extensions.", Arrays.toString(extendWith.profiles()));
        }
    }

    private boolean evaluateCondition(ExtensionContext context, ExtendWithProfileCondition extendWith) {
        Environment environment = SpringExtension.getApplicationContext(context).getEnvironment();
        return ArrayUtils.isEmpty(extendWith.profiles()) ||
                Arrays.stream(environment.getActiveProfiles()).anyMatch(profile -> ArrayUtils.contains(extendWith.profiles(), profile));
    }

}
```

**Use the Conditional Extension Registration in Tests**

Now, we can use our conditional extension mechanism in tests:

```java

@ExtendWithProfileCondition(profiles = "dev", extensions = {MyBeforeEachExtension.class, MyBeforeAllExtension.class})
@ExtendWith(SpringExtension.class)
@ActiveProfiles("dev")
class MyConditionalTest {

    @Test
    void myTestCase() {
        System.out.println("MyBeforeEachExtension & MyBeforeAllExtension executed only when spring profile 'dev' activated!");
    }

    @Test
    @ExtendWithProfileCondition(profiles = {"prod", "dev"}, extensions = {MyBeforeEachMethodExtension.class})
    void myTestCase() {
        System.out.println("MyBeforeEachMethodExtension executed only when spring profile either 'dev' or 'prod' activated!");
    }

    @Test
    @ExtendWithProfileCondition(profiles = "dev", extensions = {MyBeforeTestMethodExtension.class})
    void myHelloWorld_2() {
        System.out.println("MyBeforeTestMethodExtension executed only when spring profile 'dev' activated!");
    }
}
```

## Resolver for Env Variables

**Define the conditional extension annotation**

```java

```

**Implement the Conditional Extension Resolver**

```java

```

**Use the Conditional Extension Registration in Tests**

```java

```

## Resolver for Feature Flags

**Define the conditional extension annotation**

```java

```

**Implement the Conditional Extension Resolver**

```java

```

**Use the Conditional Extension Registration in Tests**

```java

```

## **Conclusion**

By implementing a **generic conditional extension resolver**, we gain the flexibility to apply extensions based on a
variety of runtime conditions. This approach keeps our test setup **clean**, **reusable**, and **extensible**, ensuring
that extensions are only applied when necessary.

This method can be expanded further easily to support:

- **System properties (`System.getProperty()`)**
- **Application Configuration Properties**
- **Test Profiles**
- **Operating System**
- **User Role**
- **Resource Availability**
- **Time of Day**
- **Custom database or API checks**


