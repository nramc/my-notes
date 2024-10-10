# Useful Kubernetes Commands

## Debugging Pod

- Sometimes we may need to connect to a Kubernetes pod to perform simple tasks like executing simple commands, checking
  connectivity from pod to other networks, for such activities the below debug command really helps Developer who does
  not have much knowledge about Kubernetes
- Check [kubectl debug](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_debug/) to know more

  ```shell
  kubectl --cluster=<cluster name> -n <namespace> debug <targeted pod> --image=internal/koopa/toolbox-image:latest -it
  ```
  

