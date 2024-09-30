<style>
 #why-do-we-need-openrewrite + ul, #key-takeaways + ul {
    font-size: 0.7rem;
}
</style>

# OpenRewrite Integration

[OpenRewrite](https://docs.openrewrite.org/)  is a powerful, automated refactoring tool designed to help developers
modernize and improve their codebases efficiently.

## Why Do We Need OpenRewrite?

- **Automated Code Refactoring:**
  Manually updating code can be tedious and error-prone, especially when dealing with large codebases. OpenRewrite
  automates repetitive tasks like upgrading deprecated APIs, adjusting library versions, and fixing outdated patterns,
  saving developers hours of manual work.
- **Ensure Code Consistency:**
  In large teams or organizations, different developers may write code in slightly different
  styles or patterns. OpenRewrite ensures that changes are applied consistently across the entire codebase, maintaining
  uniformity in coding standards.
- **Maintainable and Modern Code:**
  As programming languages evolve and libraries are updated, developers need to keep
  their codebases modern. OpenRewrite simplifies this process by automatically updating APIs, language features, and
  libraries without having to rewrite everything manually, allowing developers to adopt the latest best practices
  effortlessly.
- **Faster Technical Debt Reduction:**
  Over time, codebases accumulate technical debt, such as outdated code, inefficient patterns, or unused imports.
  OpenRewrite helps developers tackle this debt by automating refactoring tasks, ensuring the codebase stays clean,
  efficient, and manageable without requiring dedicated time for manual cleanup.
- **Improve Security Automatically:**
  Security vulnerabilities in dependencies are a major concern for developers. OpenRewrite can automate updates to
  vulnerable libraries and ensure the project is running on secure versions. This keeps the code secure without
  developers needing to manually track and update dependencies.
- **Easier Legacy Code Maintenance:**
  Legacy codebases are often difficult to maintain due to outdated technologies, libraries, or patterns. Developers can
  use OpenRewrite to automatically refactor and modernize these legacy systems, improving readability, maintainability,
  and performance, all while minimizing the risk of introducing bugs.
- **Integrates Seamlessly with Development Workflow:**
  OpenRewrite works well with Maven, Gradle, and other build tools, and can be easily integrated into continuous
  integration/continuous deployment (CI/CD) pipelines. This means developers don’t have to change their workflow, and
  refactoring can happen automatically as part of the regular development process.
- **Customizable Refactoring for Specific Needs:**
  Sometimes, teams have specific requirements for refactoring that don’t fit standard patterns. OpenRewrite allows
  developers to write custom recipes tailored to their project’s unique needs, enabling automatic, project-specific code
  transformations that address edge cases or organizational standards.
- **Future-Proofing Codebases:**
  By continuously applying OpenRewrite to a project, developers can ensure their codebase remains modern and adaptable
  to future changes in the ecosystem. This reduces the need for large, disruptive refactorings down the line, allowing
  for smoother, incremental updates.
- **Improve Developer Productivity:**
  Developers want to focus on building new features and solving complex problems, not performing tedious refactorings.
  By automating these tasks, OpenRewrite frees up time and mental energy, allowing developers to concentrate on
  higher-value activities.

## Getting Started

Please refer [official OpenRewrite guide](https://docs.openrewrite.org/running-recipes/getting-started) to get started.

## Binding execution with Maven Life Cycle phases

- Instead of executing rewrite goal individually, we can also bind the execution goal with maven life cycles like
  verify
- Configure rewrite plugin goal run or runNoFork with maven phase "process-sources" and dryRun or dryRunNoFork with "
  prepare-package"

```xml

<plugin>
    <groupId>org.openrewrite.maven</groupId>
    <artifactId>rewrite-maven-plugin</artifactId>
    <version>${rewrite-maven-plugin.version}</version>

    <executions>
        <!-- run recipes to make changes when enabled -->
        <execution>
            <id>run-open-rewrite-execution</id>
            <goals>
                <goal>runNoFork</goal>
            </goals>
            <phase>process-sources</phase>
        </execution>

        <!-- dryRun execution to detect changes without making actual changes -->
        <execution>
            <id>dry-run-open-rewrite-execution</id>
            <goals>
                <goal>dryRunNoFork</goal>
            </goals>
            <phase>prepare-package</phase>
        </execution>

    </executions>

    <configuration>
        <failOnDryRunResults>true</failOnDryRunResults>
        <!-- list recipes to be executed when enabled -->
        <activeRecipes>
            <recipe>org.openrewrite.java.RemoveUnusedImports</recipe>
        </activeRecipes>
    </configuration>
</plugin>
```

## Integration with CI & CD

- Executing dryRun goal as part of CI pipeline, helps to enforce clean code policy
- Implementing toggles with dedicated CI profile helps to control recipe executions such toggles useful for complex
  projects to enable/disable recipes execution can not be applied immediately all together

My approach below is,

1. Always execute `rewrite:run` goal in developer work station to make changes in source code, so that the
   changes verified by developer and corrected if required any.
2. Always execute `rewrite:dryRun` goal in both developer workstation and CICD workflow to ensure clean code

To achieve the approach, follow below steps,

- To control `rewrite:run` and `rewrite:dryRun` goals, define two toggle and set default values
  ```xml
    <!-- open-rewrite "run" toggle which make changes in source code: default enabled  -->
    <rewrite-maven-plugin.skip.run-execution>false</rewrite-maven-plugin.skip.run-execution>
    
    <!-- open-rewrite "dryRun" toggle which does make changes, instead provide report for anticipated changes: default enabled  -->
    <rewrite-maven-plugin.skip.dry-run-execution>false</rewrite-maven-plugin.skip.dry-run-execution>
  ```
- Disable `rewrite:run` toggle for CI profile based `CI` env variable.
- Please find below pom.xml which contains CI profile with toggle and dryRun execute in CI pipeline and recipes applied
  on developer work station,
  ```xml
  <profiles>
    <profile>
        <id>ci-profile</id>
        <properties>
            <!-- Recommendation: always disable "run" which makes changes to source code in CI pipeline
             and run them only on developer workstation so that the changes reviewed manually -->
            <rewrite-maven-plugin.skip.run-execution>true</rewrite-maven-plugin.skip.run-execution>
        </properties>
        <activation>
            <property>
                <name>env.CI</name>
                <value>true</value>
            </property>
        </activation>
    </profile>
  </profiles>
  ```
- Configure plugin with different executions with toggle,
  ```html
  <plugin>
      <groupId>org.openrewrite.maven</groupId>
      <artifactId>rewrite-maven-plugin</artifactId>
      <version>${rewrite-maven-plugin.version}</version>
       
      <executions>
          <!-- Apply Recipes conditionally -->
          <execution>
              <id>run-open-rewrite-execution</id>
              <goals>
                  <goal>runNoFork</goal>
              </goals>
              <phase>process-sources</phase>
              <configuration>
                  <rewriteSkip>${rewrite-maven-plugin.skip}</rewriteSkip>
              </configuration>
          </execution>
   
          <!-- dryRun execution to detect changes without making actual changes -->
          <execution>
              <id>dry-run-open-rewrite-execution</id>
              <goals>
                  <goal>dryRunNoFork</goal>
              </goals>
              <phase>prepare-package</phase>
          </execution>
       
      </executions>
   
      <configuration>
          <!-- make build fail when changes detected during dryRun, this helps to maintain clean code by forcing  -->
          <failOnDryRunResults>true</failOnDryRunResults>
          <!-- list recipes to be executed when enabled -->
          <activeRecipes>
              <recipe>...</recipe>
          </activeRecipes>
           
          <!-- Code Formatting style to be applied -->
          <activeStyles>
              <style>org.openrewrite.java.IntelliJ</style>
          </activeStyles>
      </configuration>
   
      <dependencies>
      <!-- list of external dependencies which is needed for recipes e.g. spring upgrade recipes  -->
      </dependencies>
   
  </plugin>
  ```

## Recommended Recipes

- Below are my personal recommendations
  ```yaml
  ---
  type: specs.openrewrite.org/v1beta/recipe
  name: io.github.nramc.recipes.source
  recipeList:
    - org.openrewrite.staticanalysis.CommonStaticAnalysis
    - org.openrewrite.staticanalysis.CodeCleanup
    - org.openrewrite.java.security.JavaSecurityBestPractices
    - org.openrewrite.java.security.OwaspTopTen
    - org.openrewrite.java.RemoveUnusedImports
    - org.openrewrite.recommendations.CodeHealth
    - org.openrewrite.recommendations.DependencyManagement
    - org.openrewrite.maven.BestPractices
    - org.openrewrite.java.logging.slf4j.Slf4jBestPractices
    - org.openrewrite.recipes.JavaRecipeBestPractices
   
  ---
  type: specs.openrewrite.org/v1beta/recipe
  name: io.github.nramc.recipes.testing
  recipeList:
    - org.openrewrite.java.testing.mockito.MockitoBestPractices
    - org.openrewrite.java.testing.junit5.CleanupAssertions
    - org.openrewrite.recipes.RecipeTestingBestPractices
    - org.openrewrite.java.testing.junit5.StaticImports
    - org.openrewrite.java.testing.cleanup.TestsShouldNotBePublic
    - org.openrewrite.java.testing.cleanup.RemoveTestPrefix
    - org.openrewrite.java.testing.cleanup.AssertLiteralBooleanToFailRecipe
    - org.openrewrite.java.testing.testcontainers.TestContainersBestPractices
   
   
  ---
  ```

## Key Takeaways

- It generally makes sense to add the plugin to the root `pom.xml` in a maven Multi-Module repository so that the
  configuration applies to
  each module
    - You might encounter some issues when running Open Sourced OpenRewrite plugin in Multi-module maven projects,
      always refer [Multi-Module Projects](https://docs.openrewrite.org/running-recipes/multi-module-maven)  for known
      issues
    - If your issue not listed there with solution, then please create ticket
      on [GitHub:issues](https://github.com/openrewrite/rewrite-maven-plugin/issues)

- No Recipe or No Style is run unless explicitly turned on explicitly with setting either in pom.xml or in command line
- Recipes are classified differently for Source and Test codes. Therefore, it is important to note that not all recipes
  executed for test codes.
- The goals `rewrite:run` and `rewrite:dryRun` are configured to fork Maven's life cycle and are a better choice when
  running recipes via a stand-alone goal (`mvn rewrite:run`) because this will trigger all the necessary life-cycle
  goals
  prior to running rewrite's plugin
- The goals `rewrite:runNoFork` and `rewrite:dryRunNoFork` are more efficient to use them within the context of an
  integration build, as these will not cause duplicate life cycle phases to be called
- My Personnel recommendation, prefer maven phase `process-sources` for binding `run` or `runNoFork` execution,
  therefore
  making changes in source code performed before unit test and integration tests execution
- Prefer maven phase `prepare-package` for binding `dryRun` or `dryRunNoFork` execution,
  therefore maven build failed early before time-consuming integration tests executed
- Always configure plugin to execute `dryRun` and make build fail if any changes exists to avoid adding any new findings
- Enabled config in such a way recipes applied only on developer workstation and not in CI environment to avoid
  commiting unintended changes.
- Recommendation is always check changes and commit them manually after verification
- [OpenRewrite IntelliJ Plugin](https://plugins.jetbrains.com/plugin/23814-openrewrite) really helps to organise and run
  recipe in developer workstation

