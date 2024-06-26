# Logs Verification

Login:

    dexctl --user <user-id>

List all available contexts:

    kubectl config get-contexts

Set current context to targeted one:

    kubectl config use-context <targeted context>

## Logs for all pods / deployment

List deployments:

    kubectl get deployments -n <target namespace>

List logs for all pods:

    kubectl logs deployments/<deployment name>

## Logs for a particular pod

List all pods:

    kubectl get pods -n <target namespace>

List logs for a particular pod:

    kubectl logs <targted pod name>


