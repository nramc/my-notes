---
author: Ramachandran Nellaiyappan
createdAt: 10.10.2024
updatedAt: 17.02.2025
categories:
  - Scripts
tags:
  - Scripts
---

# Useful Kubernetes Commands

## Executing Commands in Kubernetes Pod

- Sometimes we may need to connect to an existing Kubernetes pod to perform simple tasks like executing simple commands,
  checking
  connectivity from pod to other networks; for such activities the below command really helps Developers

```shell
# Authenticate and switch to the targeted Kubernetes context
dexctl --user <username>
kubectl config use-context <targeted context>

# List all namespaces in the current context
kubectl get namespaces

# List all pods in a specific namespace
kubectl get pods --namespace <namespace>

# Connect to a pod and open an interactive bash terminal for debugging
kubectl exec --stdin --tty --namespace <namespace> <pod-name> -- /bin/bash

# Execute a single command (e.g., check the current date) inside a pod
kubectl exec -it --namespace <namespace> <pod-name> -- date
```

## Debugging Pod

- Sometimes we may need to connect to a Kubernetes pod and perform simple tasks without modifying its existing
  container like executing simple commands, checking connectivity from pod to other networks; for such activities, the
  below debug command really helps Developers
- Check [kubectl debug](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_debug/) to know more

```shell
kubectl --cluster=<cluster name> -n <namespace> debug <targeted pod> --image=internal/koopa/toolbox-image:latest -it
```

## Download a secret file from Kubernetes

- Sometimes we might save file in Kubernetes secrets e.g. client certificate, ssh keys, any encrypted files
- We might sometimes need such files on our local machine for debugging or local development
- These files might not be copied directly or downloadable directly from the Kubernetes UI.
  In this case, the below command really helps to download as it is.

```shell
  kubectl --cluster=<cluster name> -n <namespace> get secrets "<name of the entry>" -o json | jq -r '.data."<key>"' | base64 -d > <desired target file name e.g. localhost.p12>
```

## Port Forwarding

- Sometimes we might need to debug a pod on Kubernetes, for example, testing configurations.
- Sometimes our local application might want to connect to a particular Kubernetes pod, in these
  cases [Port Forwarding](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_port-forward/) really helpful.

```shell
kubectl get pods -n <namespace> --cluster=<cluster name>

kubectl --cluster=<cluster name> -n <namespace> port-forward <intended pod> <local port 1>:<remote port 1 > ... <local port n>:<remote port n> 
```
