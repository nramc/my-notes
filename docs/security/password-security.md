---
author: Ramachandran Nellaiyappan
createdAt: 03.09.2024
updatedAt: 
categories:
  - Password
tags:
  - Improvements
  - Password
  - Data Quality
  - Secure Coding
---
# Password Protection & Improvements

## Prevent Weak Passwords

- [zxcvbn](https://github.com/nulab/zxcvbn4j) library helps to measure password strength in terms of score against
  common
  english words, common patterns & sequences and even we can customize rule base with custom dictionaries
- Measure user's password strength and prevent user's to use password for which strength score less than allowed (e.g.
  prevent score less 3 out of 5)

## Prevent Leaked Passwords

- [HaveIBeenPwned](https://haveibeenpwned.com/) allows you to search across multiple data breaches to see if your email
  address or phone number has been compromised.
- It supports REST API as well
- It has leaked password database and has secured way to compare passwords using hashing techniques
- Tip: Spring Security has HaveIBeenPwnedRestApiPasswordChecker API which helps application to securely connect to
  the [HaveIBeenPwned](https://haveibeenpwned.com/API/v3#PwnedPasswords) service  


