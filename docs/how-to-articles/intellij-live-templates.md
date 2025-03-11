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