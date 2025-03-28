---
author: Ramachandran Nellaiyappan
createdAt: 10.07.2024
updatedAt: 16.02.2025
categories:
  - Developer Tools
  - Workstation Setup
tags:
  - Productivity
  - Workstation Setup
  - Developer Tools
  - Latest
---

# Developer Workstation Tools

Tools helps developer to improve productivity and simplify running application or services smoothly, conveniently.

## Useful simple Git configuration

- When you work with two or more different Git accounts and want to have different configuration for each account, you
  can use conditional git configuration. For example, in my case I want to have my organisation account configurations
  like company email address for internal organisation repositories and my personal email address for Open Source
  repositories.

    ``` bash
    # create dedciated git config for personal account in user home directory and define config.
    # in my case i want to use short name and personal email address for open source projects
    cat .gitconfig-github 
    [user]
      name = Ram
      email = ramachandrannellai@gmail.com
  
    # configure the config in main .gitconfig conditionally
    cat .gitconfig
    # my organisation based config
    [user]
      name = Ramachandran Nellaiyappan
      email = ramachandran.nellaiyappan@mycompany.com
    
    [includeIf "gitdir:~/Ram/github/"]
      path = .gitconfig-github
    
    ```

- my favorite one line log format, it might help you as well

  ```bash
    git config --global alias.onelog 'log --graph --decorate --pretty="%C(white) Hash: %h %C(red)Date: %ad %C(yellow) %C(blue) Author: %an %C(green)Message: %s " --date=human'
  ```

- one of my most frequently used git command

  ```bash
    git config --global alias.undo 'reset --soft HEAD~1'
  ```

## Clean as You Code

- [SonarLint](https://www.sonarsource.com/products/sonarlint/) Plugin for IDE: Detect bugs and code smells as early as
  possible while you code

## EnvFile: Manage Environment Variables

- [EnvFile](https://plugins.jetbrains.com/plugin/7861-envfile) allows you to set environment variables for your run
  configurations from one or multiple files
- It supports YAML, JSON and .env formats

## mkcert: Local Trust store for Local Development

- [mkcert](https://github.com/FiloSottile/mkcert) A simple zero-config tool to make locally trusted development
  certificates with any names you'd like
- Using certificates from real certificate authorities(CAs) for development can be dangerous or impossible (for hosts
  like example.test, localhost or 127.0.0.1), but self-signed certificates cause trust errors.
- Managing your own CA is the best solution, but usually involves arcane commands, specialized knowledge and manual
  steps.
- [mkcert](https://github.com/FiloSottile/mkcert) automatically creates and installs a local CA in the system root
  store, and generates locally-trusted certificates.
- [mkcert](https://github.com/FiloSottile/mkcert) does not automatically configure servers to use the
  certificates, though, that's up to you.

## Design and Document your feature

- [PlantUML](https://plantuml.com/) IDE plugin helps us to write varies diagrams by writing code for documenting your
  feature

