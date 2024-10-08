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

## Obfuscate Sensitive Information

- Sensitive information like username, password and OneTimeToken, sometimes unknowingly logged in log files, and it
  might
  lead to potential information leak
- To avoid such accidental information leak, it is always recommended to obfuscate such information either partially or
  completely
- example overriding default toString() to obfuscate complete information as follows

```java
  record Password(String value) {
    @Override
    public String toString() {
        return "Password { 'value': '***' }";
    }
}
```

- example obfuscate partial information about email address

```java

record EmailAddress(String value) {
    @Override
    public String toString() {
        return "EmailAddress {'value': '%s'}".formatted(EmailAddressObfuscator.obfuscate(value));
    }
}


/**
 * Obfuscates an email address by starring the local part (username), except the first character.
 * <p>
 * If the local part has only one character, then this will be starred.
 * </p>
 * <p>
 * For example the email address <c>name.surname@example.com</c> will be obfuscated as <c>n***********@example.com</c>.
 * </p>
 */
public final class EmailAddressObfuscator {
    private static final String EMAIL_ADDRESS_SEPARATOR = "@";
    private static final int NO_VISIBLE_LOCAL_PART_CHARS = 1;
    private static final String MASK_CHAR = "*";

    private EmailAddressObfuscator() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }


    private static String getNonLocalPart(String emailAddress) {
        return StringUtils.substringAfterLast(emailAddress, EMAIL_ADDRESS_SEPARATOR);
    }

    private static String getLocalPart(String emailAddress) {
        return StringUtils.substringBeforeLast(emailAddress, EMAIL_ADDRESS_SEPARATOR);
    }

    private static String obfuscateLocalPart(String emailAddress) {
        String localPart = getLocalPart(emailAddress);
        return StringUtils.substring(localPart, 0, NO_VISIBLE_LOCAL_PART_CHARS)
                + StringUtils.repeat(MASK_CHAR, StringUtils.length(localPart) - NO_VISIBLE_LOCAL_PART_CHARS);
    }

    private static String getObfuscateValue(String emailAddress) {
        return obfuscateLocalPart(emailAddress) + EMAIL_ADDRESS_SEPARATOR + getNonLocalPart(emailAddress);
    }


    public static String obfuscate(final String emailAddress) {
        return Optional.ofNullable(emailAddress)
                .filter(StringUtils::isNotBlank)
                .map(EmailAddressObfuscator::getObfuscateValue).orElse("");
    }

}

```
