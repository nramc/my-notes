var __index = {"config":{"lang":["en"],"separator":"[\\s\\-]+","pipeline":["stopWordFilter"]},"docs":[{"location":"index.html","title":"Welcome.!","text":""},{"location":"about.html","title":"About Us","text":"<ul> <li>This application contains information and reference which is being used for my reference</li> <li>Feel free to use it if needed</li> </ul>"},{"location":"development/validations.html","title":"Validation","text":""},{"location":"development/validations.html#phone-number-validation","title":"Phone Number Validation","text":"<ul> <li>Google provides an excellent library libphonenumber for mobile &amp; phone   number validation</li> <li>The library helps to format numbers based on geographical format</li> <li>The Library provides normalization feature to remove unwanted characters</li> <li>The Library has various distribution for many languages</li> </ul>"},{"location":"improvements/Documentation.html","title":"Documentation","text":""},{"location":"improvements/Documentation.html#mkdocs-markdown-documentation","title":"MkDocs - Markdown Documentation","text":"<ul> <li>MkDocs helps us to write any documentation with Markdown   like technical concept, blog, etc.</li> <li>Material for MkDocs provides material theme for documentation</li> <li>Varies plugins available for adding graphs, UML, etc diagrams programmatically</li> </ul>"},{"location":"improvements/Documentation.html#plantuml","title":"PlantUML","text":"<ul> <li>PlantUML helps us to write varies diagrams by writing code</li> <li>PlantUML IDE plugin really helpful for creating UML diagrams</li> </ul>"},{"location":"improvements/code-health-improvement.html","title":"Improve Code Health &amp; Reduce Technical Debt","text":""},{"location":"improvements/code-health-improvement.html#auto-upgrade-dependencies","title":"Auto upgrade dependencies","text":"<ul> <li>Use automated bot to update your project dependencies automatically in order to catch up with latest versions.</li> <li>Renovate provides easy integration and flexible if your organisation use   it. Documentation</li> <li>GitHub Dependent Bot if your repository exists in GitHub, you can use GitHub's   in-house dependent bot for auto updating dependencies.  </li> </ul>"},{"location":"java/java-notes.html","title":"Java Notes","text":""},{"location":"kubernetes/logs-verification.html","title":"Logs Verification","text":"<p>Login:</p> <pre><code>dexctl --user &lt;user-id&gt;\n</code></pre> <p>List all available contexts:</p> <pre><code>kubectl config get-contexts\n</code></pre> <p>Set current context to targeted one:</p> <pre><code>kubectl config use-context &lt;targeted context&gt;\n</code></pre>"},{"location":"kubernetes/logs-verification.html#logs-for-all-pods-deployment","title":"Logs for all pods / deployment","text":"<p>List deployments:</p> <pre><code>kubectl get deployments -n &lt;target namespace&gt;\n</code></pre> <p>List logs for all pods:</p> <pre><code>kubectl logs deployments/&lt;deployment name&gt;\n</code></pre>"},{"location":"kubernetes/logs-verification.html#logs-for-a-particular-pod","title":"Logs for a particular pod","text":"<p>List all pods:</p> <pre><code>kubectl get pods -n &lt;target namespace&gt;\n</code></pre> <p>List logs for a particular pod:</p> <pre><code>kubectl logs &lt;targted pod name&gt;\n</code></pre>"},{"location":"security/secure-coding.html","title":"Secure Coding","text":""},{"location":"security/secure-coding.html#ide-setup","title":"IDE Setup","text":"<ul> <li>SonarLint Plugin for IDE: Detect bugs and code smells as early as   possible while you code   You can even bind you organisation's quality gate if exists any</li> </ul>"},{"location":"security/secure-coding.html#xss-encode-for-client","title":"XSS: Encode for client","text":"<ul> <li> <p>OWASP Java Encoder helps to encode values based on client use case to   avoid any XSS attack </p> </li> <li> <p>Similar to html, dedicated methods available for CSS(<code>forCssString</code>) and JS (<code>forJavaScript</code>) as well </p> </li> <li>Similarly different encoding methods available for script/style   attribute(<code>forJavaScriptAttribute, forCssString-</code>), block (<code>forJavaScriptBlock</code>) and URL   components (<code>forCssUrl, forJavaScriptSource</code>) parameter   <pre><code>// when you want to place json properties inside &lt;script type=\"application/json\"&gt;${toJson()}&lt;/script&gt; in html\npublic String toJson() {\nObjectMapper objectMapper = new ObjectMapper();\ntry {\nreturn Encode.forHtmlContent(objectMapper.writeValueAsString(this));\n} catch (JsonProcessingException ex) {\nlog.error(\"Serialization error.\", ex);\n}\nreturn null;\n}\n</code></pre></li> </ul>"}]}