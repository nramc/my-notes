# User Registration Improvements

## Prevent using Weak Passwords

- [zxcvbn](https://github.com/nulab/zxcvbn4j) library helps to measure password strength in terms of score against
  common
  english words, common patterns & sequences and even we can customize rule base with custom dictionaries
- Measure user's password strength and prevent user's to use password for which strength score less than allowed (e.g.
  prevent score less 3 out of 5)
