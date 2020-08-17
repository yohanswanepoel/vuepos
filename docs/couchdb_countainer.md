# Couch DB Container Build
I decided to deploy the components using containers that will ultimately be enterprise ready and kubernetes ready.

The couchdb container build files are based on the official Apache build files for the Red Hat universal base image

## Container commands

Build
```bash
buildah bud -t couchdb -f Containerfile . 
```

Run
```bash
podman run -d --name vue-couchdb -p 5984:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password localhost/couchdb 

# storage requires this switch
-v /home/couchdb/data:/opt/couchdb/data
```