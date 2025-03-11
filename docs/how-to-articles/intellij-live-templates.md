---
author: Ramachandran Nellaiyappan
createdAt: 11.03.2025
updatedAt:
categories:
  - Workstation Setup
tags:
  - Workstation Setup
  - Productivity
---

# IntelliJ IDEA Live Templates

You can download all below live templates as a file.

[Download File](../assets/data/intellij-idea-live-templates/custom-intellij-idea-live-templates.xml){ .md-button .md-button--primary }

You can place them inside your IntelliJ IDEA in
`~/Library/Application Support/JetBrains/<IntelliJIdea version>/templates/`

## Java

**Static Factory Method**

```shell
# template
public static $CLASS_NAME$ valueOf($PARAM_TYPE$ $PARAM_NAME$) {
    return new $CLASS_NAME$($PARAM_NAME$);
}

# binding parameters with expression
CLASS_NAME -> className()
PARAM_TYPE -> guessElementType()
PARAM_NAME -> suggestVariableName()

```

