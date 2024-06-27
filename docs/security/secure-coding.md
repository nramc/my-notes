# Secure Coding

## XSS: Encode for client

- [OWASP Java Encoder](https://owasp.org/www-project-java-encoder/) helps to encode values based on client use case to
  avoid any XSS attack
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
    - Similar to html, dedicated methods available for CSS(`forCssString`) and JS (`forJavaScript`) as well
    - Similarly different encoding methods available for script/style
      attribute(`forJavaScriptAttribute, forCssString-`), block (`forJavaScriptBlock`) and URL
      components (`forCssUrl, forJavaScriptSource`) parameter
