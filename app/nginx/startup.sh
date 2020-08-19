#!/bin/sh

CONF_FILE=
if echo $EXTERNAL_URL | grep https
then
    CONF_FILE="-c nginx-ssl.conf"
fi

if [ -z "$COUCHDB_HOST" ]
then
      COUCHDB_HOST = localhost
fi

CACHE_NAME=`date "+%s"`

#Need new cache build here

# Replace the resource paths in index yaml files to match the specified external URL
find /opt/www/public -name '*.yaml' -exec sed -i -e "s|{{EXTERNAL_URL}}|${EXTERNAL_URL%/}|" {} \;

find /etc/nginx -name '*.conf' -exec sed -i -e "s|{{COUCHDB_HOST}}|${COUCHDB_HOST}|" {} \;

find /opt/www/public -name 'sw.js' -exec sed -i -e "s|SPA_CACHE_NAME|${CACHE_NAME}|" {} \;


# Replace the resource paths in index json files to match the specified external URL
find /opt/www/public -name '*.json' -exec sed -i -e "s|{{EXTERNAL_URL}}|${EXTERNAL_URL%/}|" {} \;

if [ -z "${DRY_RUN}" ]
then
    exec nginx $CONF_FILE
else
    echo "Dry run"
    echo using $CONF_FILE
    echo user id is $(id -u)
    echo group id is $(id -g)
fi