# Small POS
This is a small scale Point of Sale systemn designed for a school canteen. 

It also served as a learning experience to see how certain capabilities can be used together. 

# Sections
* [Design principles and considerations](#dpc)
* [Technologies Used](#tech)
* [User Roles Required](#user)
* [Connectivity Requirements](#conn)
* [Setup Dev](#setupdev)
* [Setup Prod](#setupprod)
* [Todo](#todo)
* [Lessons Learned](#lessons)

## <a name="dpc"></a>Design Principles and Considerations 
The following design principles apply
* It needs to be simple to setup and manage. Canteen staff are not IT nerds
* Intermittened connections should not cause failures
* Database backups should be seamless


![Full Logical Model](docs/images/vuepos_fulllogical.png "Full Logical Model")


## <a name="tech"></a>Technologies Used
### User Interface
* Vue for the reactive web front-end capabilities
* Vuex for session management
* Vue Router for front-end routing
* Vue components using javascript files
* Bootstrap 4 for widgets
* Material Icons
* Charts.js for report charts
* No webpacks yet...

### Database
* CouchDB as the central database (needs setup wizard first run)
* CouchDB views for reports using simple Map/Reduce jobs
* PouchDB for the client side database
* Filters to manage record synchronisation and direction

create BD
```
 curl -X PUT http://admin:password@localhost:8080/couchdb/swanepos
```

### Offline asset delivery
* Progressive Web App principles and service workers

### Authentication
* Couch DB authentication

## <a name="user"></a>User roles required
* Role: pos: Use Point of Sale capability only
* Role: admin: Can manage products, view sales and reports
* Role: superadmin: Can create views and populate reference data from the App

## <a name="conn"></a>Connectivity Requirements
* Authentication requires connectivity
* Once authenticated: 
** Point of Sale writes to PouchDB -> Sales are synchronised up to Couch DB
** Product management writes to PouchDB <-> Two way synchronisation
* Reports require online connectivity and talks to CouchDB directly

## <a name="setupdev"></a>Setup development environment
### Requirements
* Database: CouchDB - good tutorial: https://pouchdb.com/guides/setup-couchdb.html
* Progressive Web Apps: A compatible browser
* Web server: I used built in Python SimpleHTTPServer
* podman

The new setup for dev uses podman to deploy Couch DB, you can include nginx in that but for that you require DNS enabled in podman.

For development purposes the containers will run in the same pod, so after build run.

```bash

# start couch db
podman run -d --pod new:devpod --name vue-couchdb -p 5984:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password localhost/couchdb

# start nginx
podman run -d --pod devpod --name nginx_pos -p 8443:8443 -p 8080:8080 localhost/nginx_pos 


```

![Development Logical Model](docs/images/vuepos_dev.png "Development Logical Model")

### User setup
* Create 3 users
* Replace values
** username: Choose a name
** display name: Choose a name
** plaintext_password: Choose a password



* Role: posadmin . This user requires database access privileges. You can do this in the CouchDB UI. The use document could look like this
```
  {
    "_id": "org.couchdb.user:posadmin",
    "name": "display name",
    "type": "user",
    "roles": ['admin'],
    "password": "plaintext_password"
  }

  curl -X PUT http://admin:password@localhost:8080/couchdb/_users/org.couchdb.user:posadmin \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"name": "posadmin", "password": "password", "roles": ["admin"], "type": "user"}'
```
* Role: superadmin . This user requires database admin privileges. You can do this in the CouchDB UI
```
  {
    "_id": "org.couchdb.user:superadmin",
    "name": "display name",
    "type": "user",
    "roles": ['superAdmin'],
    "password": "password"
  }

    curl -X PUT http://admin:password@localhost:8080/couchdb/_users/org.couchdb.user:superadmin \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"name": "superadmin", "password": "password", "roles": ["superAdmin"], "type": "user"}'

```
* Role: pos . This user requires database access privilages. You can do this in the CouchDB UI
```
  {
    "_id": "org.couchdb.user:posuser",
    "name": "display name",
    "type": "user",
    "roles": ['pos'],
    "password": "plaintext_password"
  }

    curl -X PUT http://admin:password@localhost:8080/couchdb/_users/org.couchdb.user:posuser \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"name": "posuser", "password": "password", "roles": ["pos"], "type": "user"}'
```

* Add users to database roles
** Then you can create per database authentication by creating document with id "_security" in specific database which is not versioned, e.g.
** members are normal users, they can query and update data. This example pos and posadmin
** admins are special users, that can create views and design documents. This example posadmin
```
 curl -X PUT http://admin:password@localhost:8080/couchdb/swanepos/_security \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"members":{"names":["posuser","posadmin","superadmin"],"roles":[]},"admins":{"names":["posadmin","superadmin"]}}'
```

test users
```
curl -u [user]:[password] http://localhost:8080/couchdb/swanepos/_all_docs 
```

## <a name="setupprod"></a>Production runtime options
Currently there are Container build files for
* CouchDB
* Nginx 
* Start using podman

Options being considered
* Couch-as-a-Service: GCP, IBM Cloud?, with a webserver to serve content
* Couch, proxy/webserver (Candy) on a RaspberryPi with Wifi Hotspot
* Small Intel based NUC with Podman or Kubernetes to serve components

Client-side
* Android or IPad devices would work fine

## <a name="todo"></a>ToDo
* Build out reports
* Update app content through service workers for new versions : Nginx container script should do this
* Build containerised pattern using Podman and Buildah - built, requires nginx configeration to link couchdb from app
* Build kubernetes files likely targetting OpenShift

## <a name="lessons"></a>Interesting Lessons learned along the way
* [Vue Router using JS files](docs/vuerouter.md)
* [Vue components](docs/vuecomponents.md) - there is a better way, but hey
* [Vuex session management](docs/vuex.md)
* [Replication managed direction using filters and removing local copies](docs/replication.md)
* [CouchDB logical "_id" fields](docs/logicalid.md)
* [Pagination using id fields and an array](docs/pagination.md)
* [CouchDB authentication](docs/auth.md)
* [Views and Map/Reduce jobs in CouchDB](docs/mapreduce.md)
* [Vue Lifecycle: Mounted, Created ect](docs/vuelifecycle.md)
* [Vue Computed Fields](https://vuejs.org/v2/guide/computed.html) - Official doco. Keep complex logic away from template.
* [Vue Filters](https://vuejs.org/v2/guide/filters.html) - Official doco. Useful to format data
* [Progresive Web Apps](docs/pwa.md) - Did this without special plugins
* [Couch/Pouch Database design thoughts](docs/couchpouch.md)
* [CouchDB Container File](docs/couchdb_countainer.md)
