# Small POS
This is a small scale Point of Sale systemn designed for a school canteen. 

It also served as a learning experience to see how certain capabilities can be used together. 

## Design Principles and Considerations
The following design principles apply
* It needs to be simple to setup and manage. Canteen staff are not IT nerds
* Intermittened connections should not cause failures
* Database backups should be seamless

## Technologies Used
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
* CouchDB as the central database
* CouchDB views for reports using simple Map/Reduce jobs
* PouchDB for the client side database
* Filters to manage record synchronisation and direction

### Offline asset delivery
* Progressive Web App principles and service workers

### Authentication
* Couch DB authentication


## User roles required
* Role: pos: Use Point of Sale capability only
* Role: admin: Can manage products, view sales and reports
* Role: superadmin: Can create views and populate reference data from the App

## Connectivity Requirements
* Authentication requires connectivity
* Once authenticated: 
** Point of Sale writes to PouchDB -> Sales are synchronised up to Couch DB
** Product management writes to PouchDB <-> Two way synchronisation
* Reports require online connectivity and talks to CouchDB directly

## Setup development environment
### Requirements
* Database: CouchDB - good tutorial: https://pouchdb.com/guides/setup-couchdb.html
* Progressive Web Apps: A compatible browser
* Web server: I used built in Python SimpleHTTPServer

### User setup
* Create 3 users
* Replace values
** username: Choose a name
** display name: Choose a name
** plaintext_password: Choose a password

* Role: posadmin . This user requires database access privileges. You can do this in the CouchDB UI. The use document could look like this
`
  {
    "_id": "org.couchdb.user:username",
    "name": "display name",
    "type": "user",
    "roles": ['admin'],
    "password": "plaintext_password"
  }
`
* Role: superadmin . This user requires database admin privileges. You can do this in the CouchDB UI
`
  {
    "_id": "org.couchdb.user:username",
    "name": "display name",
    "type": "user",
    "roles": ['superadmin'],
    "password": "password"
  }
`
* Role: pos . This user requires database access privilages. You can do this in the CouchDB UI
`
  {
    "_id": "org.couchdb.user:username",
    "name": "display name",
    "type": "user",
    "roles": ['pos'],
    "password": "plaintext_password"
  }
`

test users
` curl -u [user]:[password] http://localhost:5984/swanepos/_all_docs `

## Production runtime options
Options being considered
* Couch-as-a-Service: GCP, IBM Cloud?, with a webserver to serve content
* Couch, proxy/webserver (Candy) on a RaspberryPi with Wifi Hotspot
* Small Intel based NUC with Podman or Kubernetes to serve components

Client-side
* Android or IPad devices would work fine

## ToDo
* Build out reports
* Update app content through service workers for new versions
* Build containerised pattern using Podman and Buildah
* Build kubernetes files likely targetting OpenShift

## Interesting Lessons learned along the way
* Vue Router and components using JS files
* VueX manipulation of session data through mutations
* CouchDB/PouchDB replication management using filters
* Map/Reduce jobs in CouchDB
* CouchDB logical id fields they are awesome: https://pouchdb.com/2014/06/17/12-pro-tips-for-better-code-with-pouchdb.html
* Pagination using id fields and an array to keep track - pretty neat
* CouchDB authentication
* Vue flow: Mounted, Created ect
* Vue Computed Fields
* Vue Filters

