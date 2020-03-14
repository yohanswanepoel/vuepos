# Some Design thoughts for Couch and Pouch
This aims to capture some design considerations.

## A database per object type or a database with object types
It could be useful to separate transactional and reporting data. In this app to keep it simple we used a single database with a set of documentTypes to differentiate types of documents. Also composite IDs ensured fast queries.

## A database per client/user
This is another design pattern. Using a PouchDB instance per user and then using filters to replication only relevant information. This application was simple enough to not require that. Filters were used for replication to ensure directional replication.

See the [replication](replication.md) file for more information.
