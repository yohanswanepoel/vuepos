# nginx container
I decided to deploy the components using containers that will ultimately be enterprise ready and kubernetes ready.

The couchdb container build files are based on the Red Hat universal base image for security reasons

## Container commands

Build
```bash
buildah bud -t nginx_pos -f Containerfile . 
```

Run
```bash
podman run -d --name nginx_pos -p 8443:8443 -p 8080:8080 localhost/nginx_pos 
```

Stop
```bash
podman stop ngnix_pos

```

Remove
```bash
podman rm nginx_pos

```
