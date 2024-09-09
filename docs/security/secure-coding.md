# Secure Coding

## Clean As You Code

- [SonarLint](https://www.sonarsource.com/products/sonarlint/) Plugin for IDE: Detect bugs and code smells as early as
  possible while you code
  You can even bind your organisation's quality gate rules if exists any
- [SonarCloud](https://docs.sonarsource.com/sonarcloud/improving/clean-as-you-code/) does support Clean as You code
  policy for your open source projects. It is free of cost for open source projects.

## XSS: Encode for client

- [OWASP Java Encoder](https://owasp.org/www-project-java-encoder/) helps to encode values based on client use case to
  avoid any XSS attack

- Similar to html, dedicated methods available for CSS(`forCssString`) and JS (`forJavaScript`) as well
- Similarly different encoding methods available for script/style
  attribute(`forJavaScriptAttribute, forCssString-`), block (`forJavaScriptBlock`) and URL
  components (`forCssUrl, forJavaScriptSource`) parameter
  ```java
  // when you want to place json properties inside <script type="application/json">${toJson()}</script> in html
  public String toJson() {
    ObjectMapper objectMapper = new ObjectMapper();
    try {
      return Encode.forHtmlContent(objectMapper.writeValueAsString(this));
    } catch (JsonProcessingException ex) {
      log.error("Serialization error.", ex);
    }
    return null;
  }
  ```

