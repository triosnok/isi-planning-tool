<h3 align="center">isi-planning-tool infrastructure</h3>

This folder contains all "infrastructure" code, including Ansible playbooks for configuring the target server which is deployed to as well as a Helm chart for deploying the application on the configured infrastructure.

**NOTE:** Server resources are provided to us, thus not provisioned here.
The server used for testing is a virtual machine running Ubuntu 22.04 LTS.

## Configuring the server with Ansible

Ansible installs and configures the server to run K3s with a predefined set of resources.
Two playbooks are defined, one for installing the cluster and one for uninstalling the cluster.

```bash
# assumes the current working directory is infrastructure/configuration

# installing the cluster, add --ask-pass if you need to provide a password (no SSH key added)
ansible-playbook playbooks/install.yml -i hosts.yml

# uninstalling the cluster
ansible-playbook playbooks/uninstall.yml -i hosts.yml
```

The configured server does not have a network interface associated with the exposed public IP, so the NGINX Ingress Controller needs some additional configuration to work properly in this scenario.

```bash
kubectl edit svc ingress-nginx-controller -n ingress-nginx
```

Add the following to the `spec` object, where the `<private-ip>` is the private IP that external traffic is forwarded to:

```yaml
spec:
  # ... keep other fields
  externalIPs:
    - <private-ip>
```

## Deploying the application with Helm

Once configured, you can obtain secrets for accessing the cluster by SSH.

```bash
kubectl describe secret admin-sa-token
```

This can be added to your `~/.kube/config` file along with the cluster URL, to access the cluster using `kubectl`.

Example:

```yaml
apiVersion: v1
kind: Config
current-context: k3s-admin
preferences: {}
clusters:
  - name: k3s
    cluster:
      server: https://<hostname>/
users:
  - name: k3s-admin
    user:
      token: <token> # from previous step
contexts:
  - name: k3s-admin
    context:
      cluster: k3s
      user: admin
```

With `kubectl` configured, along with Helm installed, you can deploy the application using the Helm chart.

```bash
# assuming the root of the project is the current working directory
helm upgrade isi-planning-tool ./infrastructure/helm \
  --install \
  --namespace ${{ env.K8S_NAMESPACE }} \
  --set version=${{ github.ref_name }} \
  --set hostname=${{ env.HOSTNAME }} \
  --set clusterIssuer=letsencrypt
```
