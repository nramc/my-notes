---
title: "IntelliJ IDEA Live Templates"
description: "Boost coding efficiency with IntelliJ IDEA Live Templates—save time with reusable code snippets."
author: Ramachandran Nellaiyappan
date:
  created: 2025-03-11
  updated: 2025-03-17
updated:
categories:
  - Workstation Setup
tags:
  - Workstation Setup
  - Productivity
links:
  - "[Author] Ram": https://nramc.github.io/my-profile/
---

# IntelliJ IDEA Live Templates


!!! tip "You can download all below live templates as a file"

    [Download File](../../assets/data/intellij-idea-live-templates/custom-intellij-idea-live-templates.xml){ .md-button .md-button--primary }

    You can place them inside your IntelliJ IDEA in `~/Library/Application Support/JetBrains/<IntelliJIdea version>/templates/`


## Java

**Static Factory Method**

```shell
# Template Name: factoryMethod
public static $CLASS_NAME$ valueOf($PARAM_TYPE$ $PARAM_NAME$) {
    return new $CLASS_NAME$($PARAM_NAME$);
}

# Parameters binding: 
CLASS_NAME -> className()
PARAM_TYPE -> guessElementType()
PARAM_NAME -> suggestVariableName()

```

**Command Line Runner**
```shell

# Template Name: commandLineRunner
@org.springframework.context.annotation.Bean
CommandLineRunner $BEAN_NAME$() {
    return args -> {};
}

# Parameters binding: 
BEAN_NAME -> suggestVariableName()

```

**Application Runner**
```shell

# Template Name: applicationRunner
@org.springframework.context.annotation.Bean
org.springframework.boot.ApplicationRunner $BEAN_NAME$() {
    return args -> {$END$};
}

# Parameters binding: 
BEAN_NAME -> suggestVariableName()

```

**Spring Mock MVC Test**
```shell
# Template Name: mvcTest
@org.junit.jupiter.api.Test
void $TEST_METHOD$() throws Exception {
    mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("$ENDPOINT$"))
            .andDo(org.springframework.test.web.servlet.result.MockMvcResultHandlers.print())
            .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk());
}

# Parameter binding:
TEST_METHOD -> methodName()
ENDPOINT -> "/api/example"
```

**Constant**
```shell
# Template Name: constant
private static final $VAR_TYPE$ $VAR_NAME$ = "$VALUE$";

# Parameter bindings:
VAR_TYPE -> "String" / "int" / "boolean" / "List<String>"
VAR_NAME -> variableName()
VALUE -> guessValue($VAR_TYPE$)
```

## MkDocs

**MkDocs Metadata**

```shell
# Template Name: mkdocs-meta-data
---
title: $TITLE$
description: $DESCRIPTION$
author: $USER$
date: $DATE$
updated: 
categories:
  - $END$
tags:
  - todo
---

# Parameter bindings:
USER -> "Ramachandran Nellaiyappan"
DATE -> date("YYYY-MM-d")

```