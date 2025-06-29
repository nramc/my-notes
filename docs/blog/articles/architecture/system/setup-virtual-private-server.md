---
title: "Self-Hosting for Developers: A Practical Guide to Virtual Private Server (VPS) Hosting with Docker & Monitoring"
description: "From Code to Cloud: A Developer's Real-World Guide to VPS Hosting"
author: Ramachandran Nellaiyappan
date:
  created: 2025-06-29
categories:
  - Architecture
tags:
  - Self-hosting
  - Architecture
  - VPS
  - Monitoring
  - Docker
  - Latest
links:
  - "[Author] Ram": https://nramc.github.io/my-profile/
---

# Self-Hosting for Developers: A Practical Guide to Virtual Private Server (VPS) Hosting with Docker & Monitoring

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
- **⚙️ Automated Where It Matters**: Use CI/CD to deploy code changes seamlessly, with auto-restarts of containers on updates.
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

Automatically reboot the server if necessary after updates `/etc/apt/apt.conf.d/50unattended-upgrades`:

```bash
Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "03:00";
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

### Install Docker & Docker Compose

Docker is essential for running containerized applications. Install Docker and Docker Compose on your server:

```bash
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker $USER
sudo systemctl enable docker
sudo systemctl start docker
```

## Security Hardening

### Harden SSH Access

Passwords can be brute-forced. SSH keys are much harder to crack.

To improve security, we'll change the default SSH port, disable root login, and enforce key-based authentication.

Edit the SSH configuration file:

```bash
sudo nano /etc/ssh/sshd_config
```

Change the following settings:

```plaintext
# Change the default SSH port for reducing automated attack noise(optional)
Port 2222
# Disable root login
PermitRootLogin no
# Disable password authentication
PasswordAuthentication no
# Enable public key authentication
PubkeyAuthentication yes
```

Test your SSH configuration,

```bash
sudo sshd -t
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

sudo fail2ban-client status sshd
```

Check the status of Fail2ban to ensure it's running correctly:

```bash
sudo fail2ban-client status
sudo iptables -L -n
```

To unban an IP address, use the following command:

```bash
sudo fail2ban-client set sshd unbanip <IP_ADDRESS>
```

### Set Up Firewall (UFW)

Install and enable UFW (Uncomplicated Firewall) to restrict access to your server:

```bash
sudo apt install ufw -y
```

Deny all incoming connections and allow only outgoing by default:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

```bash
sudo ufw allow 2222/tcp  # your custom SSH port
sudo ufw allow http
sudo ufw allow https
```

Implement rate limiting for SSH connections to prevent brute-force attacks:

```bash
sudo ufw limit 2222/tcp  # your custom SSH port
```

Finally, enable UFW:

```bash
sudo ufw enable
```

Check the status of UFW to ensure it's active and rules are applied:

```bash
sudo ufw status verbose
# or
sudo ufw status numbered
```

To delete a specific rule, use the following command:

```bash
sudo ufw delete <rule_number>
```

Optionally, enable logging to monitor firewall activity `/var/log/ufw.log`:

```bash
sudo ufw logging on
sudo ufw logging medium
```

Once you enable firewall, finally perform a security audit to ensure everything is set up correctly:

```bash
# Check all available user accounts
getent passwd | cut -d: -f1

# Check for users with UID >= 1000 (non-system users)
awk -F: '$3 >= 1000 && $3 < 65534 { print $1 }' /etc/passwd

# Check for users with shell access
grep -vE '(/nologin|/false)' /etc/passwd | awk -F: '{print $1, $7}'

# Check for users with sudo privileges
getent group sudo | cut -d: -f4
```

### Use Security Scanner

To further enhance security, consider using a security scanner like **[Lynis](https://cisofy.com/lynis/)** to audit your
server:

```bash
sudo apt install lynis -y
sudo lynis audit system
```

Review the report and follow the recommendations.

!!! warning "Warning"

    Security is **never done**. It's a habit — not a checklist. These practices will protect you against most common attacks,
    but it's always worth staying updated on best practices.
    Regularly review your server's security posture, update packages, and monitor logs for suspicious activity.

## NGINX Setup

NGINX is a powerful web server and reverse proxy that can handle incoming traffic, route requests to your Docker
containers, and secure your applications with HTTPS.

Install Nginx on your server:

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Setup Reverse Proxy

Let's set up Nginx to act as a reverse proxy for your Dockerized applications. This allows you to access your apps
through a domain name or IP address without exposing the Docker container ports directly.

As an example, let's assume you have a Dockerized application running on port `8080` and want to access with domain name
https://example.com.

You can create a new Nginx configuration file for your application:

```bash
sudo nano /etc/nginx/sites-available/example.com
```

Add the following configuration to the file:

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:8080/;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Create a symbolic link to enable the configuration:

```bash
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
```

Test the Nginx configuration for syntax errors:

```bash
sudo nginx -t
```

Restart Nginx to apply the changes:

```bash
sudo systemctl restart nginx
```

Now, Nginx will listen on port 80 and forward requests to your Docker container running on port 8080.

!!! info "Note"

    If you want to access your application using a domain name, make sure to point your domain's DNS records to your VPS IP
    address. You can do this by creating an `A` record for your domain that points to your server's IP address.
    you can use https://dnschecker.org/ to check if your DNS records are propagated.

### Set Up HTTPS

To secure your application with HTTPS, use [Let's Encrypt](https://letsencrypt.org/) to obtain a free SSL certificate.

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d example.com
```

This command will automatically configure Nginx to use the SSL certificate and set up automatic renewal.

After setting up Nginx and obtaining the SSL certificate, verify that everything is working correctly by visiting
your domain `https://example.com` in a web browser. You should see your application served over HTTPS.

### Set Up Automatic SSL Renewal

To ensure your SSL certificate is renewed automatically, add a cron job:

```bash
sudo crontab -e
```

Add the following line to run the renewal command daily:

```plaintext
0 0 * * * certbot renew --quiet
```

### Implement rate limiting

To protect your applications from abuse, you can implement rate limiting in Nginx. This helps prevent DDoS attacks and
ensures fair usage of resources.

You can set up a rate limit in your Nginx configuration file,
Create or edit your Nginx configuration file (e.g., `/etc/nginx/sites-available/example.com`):

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

This configuration limits each IP address to 5 requests per second, with a burst capacity of 10 requests. If the limit
is exceeded, Nginx will return a `503 Service Unavailable` response.

Test the rate limiting configuration:

```bash
for i in {1..20}; do curl -s -o /dev/null -w "%{http_code}\n" https://codewithram.dev/; done
```

If the rate limit is working correctly, you should see `200 OK` responses for the approximately first 15 requests,
followed by `503 Service Unavailable` for the subsequent requests that exceed the limit.

## Application Deployment

Now that your server is set up and secured, it's time to deploy your Dockerized applications.

### Deploying Dockerized Applications

My typical development workflow is as follows:

🧑‍💻Writing Code -> 🔀 Push to GitHub → ⚙️ GitHub Actions (CI/CD) → 📦 Build Docker Image → 🐳 Publish to Docker Hub

This workflow is defined in
a [journey-api/.github/workflows/release-workflow.yml](https://raw.githubusercontent.com/nramc/journey-api/refs/heads/main/.github/workflows/release-workflow.yml)
file in my repository.

Let's deploy the dockerized application using Docker Compose.

Create `docker-compose.yml` file in your VPS server:

```bash
mkdir -p /opt/myapp && cd /opt/myapp
nano docker-compose.yml
```

Configure the `docker-compose.yml` file to define your application services, networks, and volumes. Here’s a basic
example for a Spring Boot application:

```yaml

version: '3.8'
services:
  app:
    image: your-docker-image:latest
    container_name: your-app-container
    restart: always
    ports:
      - "8080:8080"  # Map host port to container port
    environment:
      - SPRING_PROFILES_ACTIVE=prod  # Set active profile
    env_file:
      - ./default.env
    volumes:
      - ./data:/app/data  # Mount a volume for persistent data
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

This `docker-compose.yml` file defines a service named `app` that uses a Docker image, maps ports, sets environment
variables, mounts a volume for persistent data, and connects to a custom network.

To start your application using Docker Compose, run the following command in the directory where your
`docker-compose.yml` file is located:

```bash
docker-compose up -d
```

This command will start your application in detached mode, allowing it to run in the background.
You can check the status of your application by running:

```bash
docker-compose ps
```

This will show you the status of your containers, including whether they are running or stopped.

### Automating Deployment

**[Watchtower](https://containrrr.dev/watchtower/)** monitors your running containers and automatically pulls new images
from Docker Hub, restarts the
containers, and cleans up old versions.

🔄 Pull latest Image → 🚀 Deploy to VPS → ♻️ Auto-Restart container → 🗑️ Clean up old images

To set up Watchtower, run the following command:

```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --interval 300 \
  --cleanup
```

This command runs Watchtower in detached mode, allowing it to monitor your containers every 5 minutes (300 seconds).

## Monitoring & Observability

In my setup, I've kept things simple and focused on what truly matters: **metrics**, **dashboards**, and **alerts** —
using tools I can run in Docker with minimal overhead.

Below are the tools I use for monitoring and observability:

| Tool                                                                                         | Purpose                                                                                     |
|----------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| **[Prometheus](https://prometheus.io/)**                                                     | Collects and stores metrics from applications and services, including Docker containers     |
| **[Node Exporter](https://prometheus.io/docs/guides/node-exporter/)**                        | Collects system metrics (CPU, memory, disk) from the host machine                           |
| **[Grafana](https://grafana.com/)**                                                          | Visualizes metrics in real-time dashboards                                                  |
| **[Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/index.html)** | Exposes health & metrics endpoints for domain-specific counters and timers (via Micrometer) |
| **[Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/)**                 | Manages alerts based on Prometheus metrics, sends notifications via email/Telegram          |

My spring boot application exposes metrics and health endpoints at `http://localhost:8080/actuator/prometheus` using
[Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/index.html) and
[Micrometer](https://micrometer.io/).

Prometheus scrapes that endpoint every 15 seconds and stores the metrics. Grafana queries Prometheus to display charts,
usage graphs, and alerts.

You can run everything using Docker, below is a sample `docker-compose.yml` file:

```yaml
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    mem_limit: 128m
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
    restart: unless-stopped
    networks:
      - monitoring-network
    extra_hosts:
      - "host.docker.internal:host-gateway"

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    mem_limit: 128m
    ports:
      - "3000:3000"
    volumes:
      - grafana-storage:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    restart: unless-stopped
    environment:
      - GF_SECURITY_ADMIN_USER= your_admin_username
      - GF_SECURITY_ADMIN_PASSWORD=your_admin_password
    networks:
      - monitoring-network

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    network_mode: host
    pid: host
    command:
      - '--path.rootfs=/host'
    volumes:
      - '/:/host:ro,rslave'
    restart: unless-stopped
    cap_add:
      - SYS_TIME
      - SYS_ADMIN

volumes:
  grafana-storage:

networks:
  monitoring-network:
    external: true
```

This `docker-compose.yml` file sets up Prometheus, Grafana, and Node Exporter in a single network called
`monitoring-network`. Make sure to create the `prometheus.yml` configuration file for Prometheus and the Grafana
provisioning files for dashboards and data sources based on your application configuration.

below is a sample `prometheus/prometheus.yml` file:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: [ 'localhost:9090' ]

  - job_name: 'node-exporter'
    static_configs:
      - targets: [ 'host.docker.internal:9100' ]

  - job_name: 'your-app-service'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: [ 'your-app-container:8081' ]

```

below is sample grafana provisioning file `grafana/provisioning/datasources/datasource.yml` for data sources:

```yaml
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
```

I've created a few Grafana dashboards to visualize the metrics from my applications:

- [Grafana Dashboards: Node Exporter Full](https://grafana.com/grafana/dashboards/1860-node-exporter-full/)
- [Grafana Dashboards: SpringBoot APM Dashboard](https://grafana.com/grafana/dashboards/12900-springboot-apm-dashboard/)

!!! tip "Tip"

    If you want to learn more about setting up observability in Spring Boot applications, check out these articles:

    - [Mastering Observability: Custom Metrics in Spring Boot with Micrometer and Prometheus](https://blog.codewithram.dev/blog/custom-metrics.html)
    - [Mastering Spring Boot Actuator: Deep Dive into Health Indicators & Info Contributors](https://blog.codewithram.dev/blog/custom-health-info-actuator-endpoints.html)

---

## Health Checks and Alerts

To ensure your applications are running smoothly, set up health checks and alerts using Prometheus Alertmanager.

Please refer to the [Prometheus Alertmanager documentation](https://prometheus.io/docs/alerting/latest/alertmanager/)
for detailed instructions on configuring alerts based on your application metrics.

I've set up alerts based
on [this article](https://grafana.com/blog/2020/02/25/step-by-step-guide-to-setting-up-prometheus-alertmanager-with-slack-pagerduty-and-gmail/)

!!! tip "Tip"

    [Awesome Prometheus alerts](https://samber.github.io/awesome-prometheus-alerts/rules.html) is a great resource for
    pre-built Prometheus alert rules that you can use as a starting point.

## Scheduled Backups

When you're running your own server, one unexpected mistake or system failure can wipe out everything — your code,
configs, uploaded files, dashboards, and even SSL certificates.

That's why backups aren't optional — they're essential.

I use a **simple Bash script** scheduled with `cron` to run every night. It backs up,

- Docker volumes and docker-compose files
- Nginx configs
- Monitoring files such as Grafana dashboard, Prometheus config, and Alertmanager rules
- Nginx SSL certificates using `certbot` to ensure I can restore HTTPS quickly
- Server configuration files, including SSH keys, UFW rules
- Application logs to help with debugging and auditing
- Cron jobs and scheduled tasks
- Environment variables and secrets using Docker secrets or `.env` files

Here's a sample backup script:

```bash
#!/bin/bash
BACKUP_DIR="/path/to/backup/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
# Backup Docker volumes
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$BACKUP_DIR":/backup \
  -e BACKUP_DIR=/backup \
  containrrr/watchtower backup
  
# Backup Nginx configs
cp -r /etc/nginx "$BACKUP_DIR/nginx"

# Backup Grafana dashboards
cp -r /var/lib/grafana/dashboards "$BACKUP_DIR/grafana"

# Backup Prometheus config
cp -r /etc/prometheus "$BACKUP_DIR/prometheus"

# Backup SSL certificates
cp -r /etc/letsencrypt "$BACKUP_DIR/letsencrypt"

# Backup server configuration files
cp -r /etc/ssh "$BACKUP_DIR/ssh"
cp -r /etc/ufw "$BACKUP_DIR/ufw"

# Backup application logs
cp -r /var/log/myapp "$BACKUP_DIR/logs"

# Backup cron jobs
crontab -l > "$BACKUP_DIR/cron_jobs.txt"

# Backup environment variables
cp -r /etc/environment "$BACKUP_DIR/environment"

# Remote MongoDB Atlas backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/mydb" \
  --archive="$BACKUP_DIR/mongo_atlas.gz" --gzip

# Compress the backup directory
tar -czf "$BACKUP_DIR.tar.gz" -C "$BACKUP_DIR" .

# Remove the uncompressed backup directory
rm -rf "$BACKUP_DIR"

# Cleanup old backups (older than 7 days)
find /opt/backups/* -type d -mtime +7 -exec rm -rf {} \;
```

This script creates a timestamped backup directory, copies essential files and directories, compresses the backup, and
cleans up old backups older than 7 days.

## Regular HouseKeeping Tasks

To keep your server running smoothly, it's important to perform regular housekeeping tasks:

- Regularly remove stopped containers, unused volumes, and dangling images `docker system prune -af --volumes`.
- Monitor disk space usage with `df -h` and clean up old logs or unused files.
- `docker restart watchtower` to ensure Watchtower is running smoothly.
- Verify HTTPS & Certificates with `certbot renew --dry-run` to ensure automatic renewal is working.
- Check application logs for errors or warnings using `docker logs your-app-container`.
- Review Prometheus and Grafana dashboards for any anomalies or performance issues.

## Conclusion

Running your own VPS isn't just a tech project — it's a developer's dream come true. 💙

You write the code, deploy it yourself, monitor it, secure it — and learn more than any tutorial can teach. It's simple,
powerful, and fully yours.

This journey isn’t about chasing perfection.    
Start small. Stay curious. Build something you can be proud of.  
Good luck on your self-hosting journey!
