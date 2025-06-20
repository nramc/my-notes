---
title: todo
description: todo
author: Ramachandran Nellaiyappan
date:
  created: 2025-06-06
categories:
  - todo
tags:
  - todo
links:
  - "[Author] Ram": https://nramc.github.io/my-profile/
---

# Virtual Private Server (VPS) Setup

## Introduction

If you're a **software developer** like me, you've probably imagined it too — owning your own domain, deploying side
projects or tools, hosting your blog, or running monitoring dashboards — all from your own private server. It's more
than just hosting; it’s about **understanding the full lifecycle of software**: from writing clean code, packaging it in
containers, securing the infrastructure, setting up CI/CD, to watching the logs and metrics in production. It’s about
building **real-world confidence**.

In this article, I’ll walk you through setting up your own **Virtual Private Server (VPS)** to host Dockerized
applications — from initial setup and hardening the server against threats, to running production-ready apps with HTTPS
and observability.

Whether you're launching your first side project or just exploring self-hosting, this guide is for
developers who want to take control of their deployment story — hands-on, down to the metal.

Let’s build something real — and make it yours.

## Choosing a VPS Provider

Before you start deploying apps, the first step is choosing where your server will live — your VPS provider.

This might seem like a small decision, but it sets the foundation for everything that follows. That said, don’t
overthink it too much in the beginning — start small, learn by doing, and evolve over time.

Most VPS providers give you a basic Linux machine with root access and some bandwidth. That's all you need to begin
self-hosting Dockerized apps. But as you grow, you'll start to notice the trade-offs between price, performance,
support, and security features.

Here are a few things to keep in mind when picking your first VPS:

- **Start Small — You Can Always Scale**: Don't overcommit to a high-end plan right away. Start with a basic instance (
  1-2 vCPUs, 2-4GB RAM) and see how it goes. You can scale up later as your apps grow or your needs change. Focus on
  learning, not perfection.
- **Look for Docker Support**: Most providers support Docker out of the box, but double-check that you can install
  Docker and Docker Compose easily. This will save you headaches later.
- **Understand What You're (Not) Getting**: Unlike cloud providers like AWS or GCP, many VPS providers don’t offer
  managed firewalls, IAM, auto backups, or DDoS protection by default. You are responsible for security hardening,
  backups, monitoring, and software updates. This gives you freedom and full control — but also more responsibility.
- **Check for Data Center Locations**: If you have a global audience, consider where the provider's data centers are
  located. Closer proximity to your users means lower latency and better performance.
- **Read Reviews and Ask for Recommendations**: Look for community feedback on forums like Reddit, Hacker News, or
  specialized hosting review sites. Ask fellow developers about their experiences with different providers. My personal
  recommendation is to start with a well-known provider like
  [DigitalOcean](https://www.digitalocean.com/), [VPS Server](https://www.vpsserver.com/), [IONOS](https://www.ionos.com/),
  [Linode](https://www.linode.com/), [fly.io](https://fly.io/) or [Vultr](https://www.vultr.com/).
  They have good documentation, community support, and are beginner-friendly.

!!! info "My Personal Recommendation"

    Don't spend too much time comparing every provider. Just pick one, start building, and you’ll learn much more by doing
    than reading endless comparison charts.

## My VPS Setup Goals

Before diving into the setup, let me share what I wanted from my VPS — not just a server, but a personal,
developer-friendly playground where I could run and observe real-world applications just like in production.

Below is the architecture I wanted to achieve:

![My VPS Setup](my-vps-server-architecture.png "My VPS Setup")

This architecture is designed to be:


<div class="grid cards" markdown>
- **🧩 Simple by Design**: no Kubernetes, no multi-cloud maze. Just a single server I control end to end.
- **👨‍💻 Developer-Centric**: Built to run real applications — mainly Spring Boot REST APIs, packaged as Docker containers,
  not to manage infrastructure.
- **🔐 Secure from Day One**: Hardened with firewall rules, SSH best practices, automatic security updates, and HTTPS via
  Let’s Encrypt.
- **📊 Observability-Ready**: Set up monitoring, logging, and health checks to understand app performance.
- **⚙️ Automated Where It Matters**: Use CI/CD to deploy code changes seamlessly, with auto-restarts containers on updates.
- **📦 Scalable by Nature**: Start small, but easily scale up as needed without major rework.
</div>

Here’s a quick breakdown of how my setup comes together:

- **[Ubuntu OS](https://ubuntu.com/)**: A reliable Linux-based server I fully control.
- **[GitHub](https://github.com/)**: GitHub as Source of Truth for version control and deployment management.
- **[SonarQube Cloud](https://docs.sonarsource.com/sonarqube-cloud/)**: SonarQube for secure coding, code quality
  and security checks.
- **[GitHub Actions](https://github.com/features/actions)**: For CI/CD, Automate builds and deployments directly from
  GitHub.
- **[Docker](https://www.docker.com/)**: to Dockerize Applications, All apps run in containers for consistency and
  isolation.
- **[Watchtower](https://containrrr.dev/watchtower/)**: Automatically restarts containers when new images are pushed to
  Docker Hub.
- **[NGINX](https://docs.nginx.com/)**: Nginx Reverse Proxy, Handles incoming traffic, routes requests, and secures with
  [Let's Encrypt](https://letsencrypt.org/) HTTPS.
- **[Grafana](https://grafana.com/) and [Prometheus](https://prometheus.io/)**: Monitor and Track app performance and
  server health.
- **[Prometheus Alert Manager](https://prometheus.io/docs/alerting/latest/alertmanager/)**:
  Performs health checks and ensure apps are running smoothly with notifications for issues.
- **[MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)**: Use externalized, managed MongoDB for
  structured data storage.
- **[GitHub Pages](https://pages.github.com/)**: Host static frontend apps (SPAs) on GitHub Pages.
- **[Render](https://render.com/)**: Offload rare background tasks to Render's pay-as-you-go async services.
- **Scheduled Backups**: Regularly back up data and configurations to avoid data loss with help of shell script and cron
  job scheduler.

!!! note "Note"

    MongoDB Atlas, Render and GitHub Pages are optional components. You can replace them with your preferred
    alternatives or self-hosted solutions. The core principles of the setup remain the same.

## Initial Server Setup

Once you've chosen your VPS provider and launched your server, it's time to lay the groundwork.

This section walks through essential steps to secure and prepare your server for deploying Dockerized
applications. I'm using **Ubuntu** as my base OS, but you can adapt these steps to any Linux distribution you prefer.

### Create New User

Connect to your VPS and create a new user. This is a good security practice to avoid using the root user for
everyday tasks.

Use SSH to connect to your server:

```bash
ssh root@your-server-ip
```

Create a new user e.g. `devops` and add it to the `sudo` group:

```bash
adduser devops
usermod -aG sudo devops
```

### Set Up SSH Key Authentication

Generate an SSH key pair on your local machine (if you haven't already):

```bash
ssh-keygen
ssh-copy-id devops@yourserver
```

now connect to your server using the new user:

```bash
ssh devops@your-server-ip
```

### Update and Upgrade Packages

Before doing anything else, ensure your server is up to date. This is crucial for security and stability.

```bash
sudo apt update && sudo apt upgrade -y
```

Set the timezone and hostname to your preference(Optional):

```bash
sudo timedatectl set-timezone Europe/Berlin
sudo hostnamectl set-hostname your-server-name
```

Automatically update the package index and upgrade installed packages:

```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

### Expanded Security Maintenance

To keep your server secure, consider enabling **[Ubuntu Pro](https://ubuntu.com/security/esm)** for extended security
maintenance (ESM) on Ubuntu LTS releases.

```bash
# Enable Ubuntu Pro
sudo pro attach <your-token>
# Check status
sudo pro status

# Enable ESM for apps and infrastructure
sudo pro enable esm-apps
sudo pro enable esm-infra
sudo pro enable livepatch
```

## Security Hardening

### Harden SSH Access

To improve security, we’ll change the default SSH port, disable root login, and enforce key-based authentication.

Edit the SSH configuration file:

```bash
sudo nano /etc/ssh/sshd_config
```

Change the following settings:

```plaintext
# Change the default SSH port to avoid automated attacks(optional)
Port 2222
# Disable root login
PermitRootLogin no
# Disable password authentication
PasswordAuthentication no
# Enable public key authentication
PubkeyAuthentication yes
```

Restart the SSH service to apply changes:

```bash
sudo systemctl restart ssh
```

### Install Fail2ban

Fail2ban protects SSH and other services by banning suspicious IPs after multiple failed login attempts to prevent
brute-force attacks.

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

**Configure Fail2ban**

Edit the Fail2ban configuration file:

```bash
sudo nano /etc/fail2ban/jail.local
```

Add or modify the following lines:

```plaintext
[sshd]
enabled = true
port = 2222  # your custom SSH port
maxretry = 5
bantime = 3600  # ban for 1 hour
```

Restart Fail2ban to apply changes:

```bash
sudo systemctl restart fail2ban
```

### Set Up Firewall (UFW)

Install and enable UFW (Uncomplicated Firewall) to restrict access to your server:

```bash
sudo apt install ufw -y
```

```bash
sudo ufw allow 2222/tcp  # your custom SSH port
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

## HTTPS Setup with NGINX & Let’s Encrypt

## Automating Deployment

## Monitoring & Observability

## Scheduled Backups

## Health Checks and Alerts

- Weekly status summary via email/Telegram
- Optional: Healthchecks.io or similar tools

## Best Practices Summary

Always keep your VPS OS and packages updated

Limit exposed ports

Use Docker secrets and .env files for sensitive configs

Regularly audit container images and dependencies

Restrict container capabilities using Docker security flags

Log and monitor everything

You want this workflow:

🧑‍💻 Code → 🐳 Docker Image → 📦 Docker Hub → 📥 VPS → 🔁 Container Auto-Restart

## Basic Security

### Change the default SSH port (optional but good for reducing noise):

```bash
sudo nano /etc/ssh/sshd_config
Port 2222
PasswordAuthentication no
PermitRootLogin no
PubkeyAuthentication yes

sudo systemctl restart sshd
```

### Create a new non-root user:

```bash
adduser youruser
usermod -aG sudo youruser
```

### Disable root login via SSH:

```bash
sudo nano /etc/ssh/sshd_config
# Change: PermitRootLogin yes → PermitRootLogin no
sudo systemctl restart sshd
```

## Automated Updates & Firewall

### Enable UFW (Uncomplicated Firewall):

```bash
sudo ufw allow 2222/tcp  # your custom SSH port
sudo ufw allow http
sudo ufw allow https
sudo ufw enable

```

### Enable automatic security updates:

```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades


sudo nano /etc/apt/apt.conf.d/50unattended-upgrades

// Enable these lines:
"${distro_id}:${distro_codename}-updates";

Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "03:00";

```

### Configure UFW to log dropped packets:

```bash
sudo ufw logging on
```

### Install Fail2Ban to protect against brute-force attacks:

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Configure Fail2Ban:

```bash
sudo nano /etc/fail2ban/jail.local
# Add or modify the following lines:
[sshd]
enabled = true
port = 2222  # your custom SSH port
maxretry = 5
bantime = 3600
```

### Regular HouseKeeping

- Regularly `docker image prune` and `docker container prune` to clean up.
-

## Install Essentials

```bash
sudo apt update && sudo apt install git curl docker.io docker-compose nginx -y
sudo usermod -aG docker youruser
```

## Setup Domain and SSL (Optional but Recommended)

Point your domain to the VPS IP.
Use Let's Encrypt for SSL:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx
```

automatically renews SSL certificates and configures Nginx.

```bash
sudo crontab -e
# Add:
0 0 * * * certbot renew --quiet

```

## Setup Automated Deployment

### GitHub Actions → SSH Deployment (simple)

Generate SSH key pair for GitHub:

```bash
ssh-keygen -t ed25519 -C "github_deploy"
```

- Add public key to ~/.ssh/authorized_keys on the server.
- Add private key as a secret in GitHub (DEPLOY_KEY).
- GitHub Actions example:

```yaml
- name: Deploy via SSH
  uses: appleboy/ssh-action@v1.0.0
  with:
    host: ${{ secrets.SERVER_IP }}
    username: youruser
    key: ${{ secrets.DEPLOY_KEY }}
    port: 2222
    script: |
      cd /home/youruser/yourproject
      git pull origin main
      docker-compose down && docker-compose up -d
```

### Watchtower – Auto Pull & Restart

Watchtower monitors running containers and pulls new versions from Docker Hub.

```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --cleanup \
  --interval 300

```

```bash
# 1. Place your docker-compose file
mkdir -p /opt/myapp && cd /opt/myapp
nano docker-compose.yml   # paste the file contents

# 2. Start the app
docker-compose up -d

# 3. Start Watchtower (can be anywhere)
docker run -d \
  --name watchtower \
  --restart always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --interval 300 \
  --cleanup

```

It checks every 5 minutes (--interval 300)

When your GitHub Action pushes a new image to Docker Hub, Watchtower will:

- Pull it
- Restart the container
- Clean up old versions
- No need to expose ports or open SSH
- Super simple and lightweight
- Secure and automated

## Subdomain-Based Routing

### Nginx Configuration

Create a new Nginx configuration file for your subdomain:

```
server {
    listen 80;
    server_name a.yourdomain.com;

    location / {
        proxy_pass http://localhost:8081/;
        # same proxy headers as above
    }
}

server {
    listen 80;
    server_name b.yourdomain.com;

    location / {
        proxy_pass http://localhost:8082/;
    }
}
```

!!! note
you can use https://dnschecker.org/ to check if your DNS records are propagated.

## Implement rate limiting

### Nginx Rate Limiting

```nginx
http {
    limit_req_zone $binary_remote_addr zone=req_limit_per_ip:10m rate=5r/s;

    server {

        location / {
            limit_req zone=req_limit_per_ip burst=10 nodelay;
            proxy_pass http://localhost:8080/;
        }
    }
}
```

## Conclusion