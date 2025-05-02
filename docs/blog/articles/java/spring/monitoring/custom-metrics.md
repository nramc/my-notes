---
title: "Mastering Observability: Custom Metrics in Spring Boot with Micrometer and Prometheus"
description: "Learn how to create and monitor custom metrics in Spring Boot using Micrometer and Prometheus for enhanced observability."
author: Ramachandran Nellaiyappan
date:
  created: 2025-04-25
categories:
  - Java
tags:
  - Java
  - Spring Boot
  - Monitoring
  - Latest
links:
  - "[Author] Ram": https://nramc.github.io/my-profile/
---

# Mastering Observability: Custom Metrics in Spring Boot with Micrometer and Prometheus

## Introduction

Ever found yourself debugging a production issue thinking, *"I wish I knew what this part of the app was really
doing..."?* You’re not alone. Logs and stack traces are helpful—but they don't always tell the full story.

**Observability** is key to maintaining reliable applications, and while built-in metrics cover the basics, they often
fall short when you need insights into your **business logic** or **background processing**.

That’s where **custom metrics** come in.

In this guide, we’ll walk through how to use **Micrometer** in a Spring Boot application to define and collect custom
metrics, and how to expose them to **Prometheus** for real-world monitoring.

### Spring Boot Actuator: The Built-In Metrics

Spring Boot Actuator provides a rich set of built-in metrics out of the box, including:

- **JVM**: memory, threads, garbage collection
- **System**: CPU usage, disk space
- **Logging**: log levels, logger stats
- **Tasks**: execution times, thread pool usage
- **Data sources**: connection pools, query times
- **HTTP**: request counts, response times
- **Kafka & Redis**: consumer lag, cache hit/miss, and more
- so on...

To know more about the built-in metrics, refer to
the [Spring Boot Actuator's Metrics](https://docs.spring.io/spring-boot/reference/actuator/metrics.html).

These are great for infrastructure-level visibility—but they won’t tell you what your **business logic** is doing.

## Why Custom Metrics?

Imagine you're building an e-commerce system. You might want to know:

- How many orders failed validation today?
- What’s the average time to process a payment?
- Is the call to the shipping provider timing out?
- How often does inventory sync fail?

The default Spring Boot metrics won’t answer any of those questions. **Custom metrics will**.

They let you monitor what actually matters to your application and your users—making them invaluable for performance
tuning, troubleshooting, and tracking your Service Level Objectives (SLOs).

## A Quick Look at the Stack

### Micrometer

[Micrometer](https://micrometer.io/) is the metrics facade used by Spring Boot. It offers a vendor-neutral API to create
and publish metrics to backends like Prometheus, Datadog, New Relic, and more.

### Prometheus

[Prometheus](https://prometheus.io/) scrapes metrics from your application at regular intervals and stores them as time
series data.
With its powerful query language (PromQL), you can slice, dice, and alert on metrics easily.

### Spring Boot Actuator

[Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/index.html) bridges the gap, exposing your
metrics (including custom ones) via HTTP endpoints like `/actuator/metrics`.

## Setting Up Micrometer and Prometheus in Spring Boot

### Add Dependencies

To get started, you need to add the necessary dependencies to your Spring Boot project.
In this example, we will use prometheus as the metrics backend.

For Maven Dependency,

```xml

<depdencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-registry-prometheus</artifactId>
    </dependency>
</depdencies>
```

For Gradle Dependency,

```groovy
implementation 'org.springframework.boot:spring-boot-starter-actuator'
implementation 'io.micrometer:micrometer-registry-prometheus'
```

### Expose Metrics Endpoint

In application.yml

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus

```

Prometheus will now scrape metrics from `/actuator/prometheus`.

## Choosing the Right Metric Type

Micrometer provides several types of metrics, each suited for different use cases. Here are some of the most common
metric types:

- **Counter**: A counter is a simple metric that only increases. It is used to count occurrences of events, such as the
  number of requests received or the number of errors encountered.
- **Gauge**: A gauge is a metric that can go up or down. It is used to measure values that can change over time, such as
  the current number of active users or the amount of memory used by the application.
- **Timer**: A timer is a metric that measures the duration of an event. It is used to measure the time taken to
  complete a task, such as the time taken to process a request or the time taken to execute a background job.
- **Distribution Summary**: A distribution summary is a metric that measures the distribution of values over time. It is
  used to measure the size of requests or responses, such as the size of files uploaded or downloaded.

## Example: Real Time Use Cases with Custom Metrics

| Use Case                                | Metric Type          | What It Tells You                                                                   |
|-----------------------------------------|----------------------|-------------------------------------------------------------------------------------|
| Failed order validations	               | Counter              | How often orders fail business rules—helps detect spikes or regressions             |
| Payment processing duration	            | Timer                | Measures latency of payment flow—helps identify slowdowns or backend issues         |
| Inventory sync queue size	              | Gauge                | Tracks current queue depth—indicates backlog or stuck jobs                          |
| Feature usage (e.g., Download Catalog)	 | Counter              | Understands which features users actually use—great for product insights            |
| File upload sizes	                      | Distribution Summary | Monitors payload size trends—useful for spotting anomalies or enforcing limits      |
| Third-party API failure count	          | Counter              | Tracks reliability of external services—helps trigger alerts or fallback mechanisms |
| Shipping provider response times        | Timer                | Detects slow API responses—useful for SLA monitoring and debugging integrations     |
| Number of background jobs in progress	  | Gauge                | Shows real-time processing load—helps with scaling and capacity planning            |
| Login attempts per user role	           | Counter              | Helps detect suspicious patterns—useful for security monitoring                     |
| Email sending failures	                 | Counter              | Tracks delivery issues—helps maintain communication reliability                     |
| Product recommendation latency	         | Timer                | Measures AI/ML component performance—useful for UX tuning and optimization          |

## Custom Metrics with Micrometer

### Counter

Counters are simple metrics that **only increase**. They are useful for counting occurrences of events, such as errors,
requests, retries, etc.

```java

private final Counter paymentFailureCounter;

public PaymentService(MeterRegistry meterRegistry) {
    this.paymentFailureCounter = Counter.builder("payment.failures")
            .description("Number of failed payment attempts")
            .tag("region", "DE") // Add tags to categorize the metric
            .register(meterRegistry);
}

public void processPayment() {
    try {
        // Payment processing logic
    } catch (Exception e) {
        paymentFailureCounter.increment();
    }
}

```

!!! tip "Tip"

    You can also use the `@Counted` annotation to automatically create counters for your methods.
    This is useful for tracking method calls without manually creating counters.
    ```java

    @Counted(value = "payment.failures", description = "Number of failed payment attempts", 
            extraTags = {"region", "DE"}, recordFailuresOnly = true) 
    public void processPayment() {
        // Payment processing logic
    }
    ```

### Gauge

Gauges are metrics that can **go up or down**. They are useful for measuring values that can change over time, such as
the current number of active users, memory usage, etc.

```java

public JobService(MeterRegistry meterRegistry) {
    this.threadPoolExecutor = Executors.newFixedThreadPool(10);
    this.userSessionManager = new UserSessionManager();
    this.cache = new Cache();

    Gauge.builder("thread.pool.active", threadPoolExecutor, ThreadPoolExecutor::getActiveCount)
            .description("Number of active threads in the pool")
            .register(meterRegistry);

    Gauge.builder("active.users", userSessionManager, UserSessionManager::getActiveUserCount)
            .description("Current number of active users")
            .register(meterRegistry);

    Gauge.builder("cache.size", cache, Cache::size)
            .description("Current number of items in the cache")
            .register(meterRegistry);

}
```

!!! warning "Warning"

    Use `Gauge` carefully. Micrometer uses weak references under the hood, referenced objects must remain alive, or the metric disappears silently.

### Timer

Timers are metrics that measure the **duration** of an event. They are useful for measuring the time taken to
complete a task, such as the time taken to process a request or the time taken to execute a background job.

```java
private final Timer paymentProcessingTimer;

public PaymentService(MeterRegistry meterRegistry) {
    this.paymentProcessingTimer = Timer.builder("payment.processing.time")
            .description("Time taken to process payment")
            .tag("region", "DE") // Add tags to categorize the metric
            .register(meterRegistry);
}

public void processPayment() {
    paymentProcessingTimer.record(() -> {
        // Payment processing logic
    });
}
```

!!! tip "Tip"

    You can also use the `@Timed` annotation to automatically create timers for your methods.
    This is useful for tracking method execution time without manually creating timers.
    ```java

    @Timed(value = "payment.processing.time", description = "Time taken to process payment", 
            extraTags = {"region", "DE"}) 
    public void processPayment() {
        // Payment processing logic
    }
    ```

### Timer with Buckets and Percentiles

Timers can be configured with custom buckets and percentiles to provide more granular insights into the performance of
your application. This is particularly useful for identifying outliers and understanding the distribution of response
times.

```java
class EmailNotificationService {

    private final MeterRegistry meterRegistry;

    public EmailNotificationService(MeterRegistry meterRegistry) {
        this.timedEmailNotification = this.email = meterRegistry;
        Timer.builder("journey.notification.email.timed")
                .description("Time taken to send email notification")
                .publishPercentileHistogram() // Optional histogram
                .publishPercentiles(0.5, 0.95, 0.99) // Optional percentiles
                .serviceLevelObjectives( // Optional service level objectives
                        Duration.ofMillis(100),
                        Duration.ofMillis(300),
                        Duration.ofMillis(500),
                        Duration.ofSeconds(1),
                        Duration.ofSeconds(2)
                )
                .register(meterRegistry);
    }

    public void sendEmail(String notificationText) {
        timedEmailNotification.record(() -> sendEmail(notificationText));
    }
}
```

Percentiles (e.g., 50th, 95th, 99th) track the spread of execution times, while buckets group data into predefined time
ranges (e.g., < 100 ms, < 500 ms). Together, they help monitor performance and highlight slow operations.

!!! warning "Warning"

    Be cautious with the number of buckets and percentiles you use. Too many can lead to high memory usage and performance degradation.

!!! tip "Tip"

    You can also use the `@Timed` annotation with custom buckets and percentiles.
    ```java
    @Timed(value = "journey.notification.email.timed", description = "Time taken to send email notification", extraTags = {"type", "email"}, percentiles = {0.5, 0.95}, histogram = true,
            serviceLevelObjectives = {0.1, 0.3, 0.5, 1, 2})
    public void sendEmail(String notificationText) {
        // Email sending logic
    }
    ```

### LongTaskTimer

**LongTaskTimer** is a special type of Micrometer timer designed for measuring tasks that take a **long time to complete
**—think seconds, minutes, or even hours.

Unlike the standard Timer, which wraps and measures quick operations (like method calls or HTTP requests), LongTaskTimer
is used when:

- You start a task at one point in time and stop it later.
- You want to measure the duration of long-running tasks, such as background jobs or batch processing.
- You want to track the number of concurrent tasks running at any given time.

```java

private final LongTaskTimer longTaskTimer;

public JobService(MeterRegistry meterRegistry) {
    this.longTaskTimer = LongTaskTimer.builder("long_running_tasks")
            .description("Long-running tasks in progress")
            .register(meterRegistry);
}

public void executeLongRunningTask() {
    // Start the task
    longTaskTimer.start();
    try {
        // Long-running task logic
    } finally {
        // Stop the task
        longTaskTimer.stop();
    }
}
```

It Produces

- `*_active_tasks`: Number of currently running tasks.
- `*_duration_seconds`: Total time all active tasks have been running (in seconds).

!!! warning "Warning"

    LongTaskTimer is not suitable for measuring short-lived tasks. For those, use the standard Timer.

!!! tip "Tip"

    You can also use the `@Timed` annotation for long running tasks.

    ```java
    @Timed(value = "journey.notification.email.timed", description = "Time taken to send email notification", extraTags = {"type", "email"}, longTask = true)
    public void sendEmail(String notificationText) {
        // Email sending logic
    }
    ```

### Distribution Summary

Distribution summaries are metrics that measure the **distribution of values** over time. They are useful for
measuring the size of requests or responses, such as the size of files uploaded or downloaded.

```java
private final DistributionSummary fileUploadSizeSummary;

public FileUploadService(MeterRegistry meterRegistry) {
    this.fileUploadSizeSummary = DistributionSummary.builder("file.upload.size")
            .description("Size of uploaded files")
            .baseUnit("bytes") // Specify the base unit for the metric
            .publishPercentileHistogram() // Optional histogram
            .publishPercentiles(0.5, 0.95, 0.99) // Optional percentiles
            .register(meterRegistry);
}

public void uploadFile(MultipartFile file) {
    // File upload logic
    fileUploadSizeSummary.record(file.getSize());
}
```

!!! warning "Warning"

    As with Timer, be mindful with histograms and SLOs—too many buckets can lead to high cardinality, affecting performance and scraping efficiency in Prometheus.

## Function-based metrics

**Function-based metrics** in Micrometer allow you to bind live values from your application state without manually
updating the metric. Unlike counters or timers that require you to increment or record manually, function-based metrics
reflect values pulled directly from an object or function at collection time. Micrometer uses a getter function you
supply, which is polled each time metrics are scraped. The value it returns becomes the metric's current value.

This is especially useful for monitoring internal states like the size of a queue, number of items in a cache, or even
memory used by a custom object.

```java

@Component
public class OrderQueue {

    private final BlockingQueue<Order> queue = new LinkedBlockingQueue<>();

    public OrderQueue(MeterRegistry registry) {
        Gauge.builder("order.queue.size", queue, BlockingQueue::size)
                .description("Current number of orders in the processing queue")
                .register(registry);
    }

    public void add(Order order) {
        queue.offer(order);
    }

    public Order poll() {
        return queue.poll();
    }
}
```

!!! warning "Warning"

    - Function-based metrics are not suitable for high-frequency updates.
    - They are best used for values that change less frequently or are expensive to compute. 
    - Don’t use them to model event frequency—use counters or timers for that.
    - Avoid expensive computations in the getter function—it's called every scrape cycle.

## Best Practices for Custom Metrics

- **Keep names consistent and descriptive**: Prefer `payment_processing_duration_seconds` over `payment_duration`.
- **Use tags wisely**: Tags are powerful but can lead to high cardinality if not used carefully. High cardinality can
  lead to performance issues and make it difficult to analyze your metrics. Avoid using user IDs, emails, or dynamic
  values as tags. Instead, use static values that are relevant to the metric.
- **Group by business use case**: When creating metrics, think about how they will be used. For example, a metric like
  `inventory_sync_failures` is more useful than `background_job_errors`.
- **Choose sensible buckets for timers and histograms**: When configuring Prometheus, choose buckets that make sense for
  your application. For example, if you are measuring response times, choose buckets that reflect the expected response
  times for your application.
- **Use labels for dimensions**: Use labels to add dimensions to your metrics. For example, you can use labels to
  differentiate between different environments (e.g., `dev`, `staging`, `prod`) or different versions of your
  application.
- **Use the right metric type for the job**: Choose the right metric type for the job. For example, if you are measuring
  a rate, use a meter. If you are measuring a duration, use a timer. If you are measuring a distribution, use a
  histogram.
- **Don’t overdo it**: Stick to what you’ll actually monitor. Every metric has a cost.

## Conclusion

Custom metrics help you shift from infrastructure monitoring to **business-level observability**.
They turn your metrics into a living dashboard of how your system is really behaving—at runtime, in production, under
a real load.

They're lightweight, powerful, and when used wisely, one of the most developer-friendly ways to stay ahead of problems.

**Design them with intent, and they’ll become one of your app’s most valuable assets.**


