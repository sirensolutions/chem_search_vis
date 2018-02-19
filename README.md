# Chemical Search plugin for Siren Federate

This repository contains the chemical search plugin for Siren Federate.
It includes the visualisation plugin for molecular searches in Siren. These searches, based on chemical fingerprint similarities, requires a service to calculate these fingerprints on the fly.
Siren provides a public site available for calculating these fingerprints at https://api.chemicalfingerprint.siren.io, but you can deploy your own service and use it in the plugin. Find below how.
   
## INSTALLATION

In order to use this widget you need to make it available to Siren Federate.

```
$ ./bin/investigate install-plugin 'https://github.com/sirensolutions/chem_search_vis/releases/download/v2.0/v2.0.zip'
```


Alternatively you can install using the provided script in this distribution. These steps assume that you have cloned `kibi-internal` and is at the same level as this repository::

```
# clone this repository if you haven't done so yet
$ git clone https://github.com/sirensolutions/chem_search_vis

# This repository should be cloned at the same level as kibi-internal:
$ ls kibi-internal

# cd into this repo and install the plugin:
$ cd chem_search_vis
$ npm install
$ node_modules/.bin/gulp sync

# At this point the plugin should have been copied in the kibi-internal plugins' repo:
$ ls ../kibi-internal/

```

## Optional: Deploy a fingerprint API:

Siren provides a public site available for calculating molecular fingerprints at https://api.chemicalfingerprint.siren.io.
The code to create this API is included in this repository under the `fingerprint_api` folder. If you prefer to deploy your own version of the API follow these instructions (Docker required)

```
cd fingerprint_api
docker build -t fp_api:latest .
docker run --name ls-api -p 8009:8080  -e PORT=8080 --rm fp_api

```


## Optional: Change the source of the chemical structures in your deploy

If you have deployed your own fingerprint API you may want to use it to create the molecular representations displayed in Siren Investigate.
By default the molecules are displayed using calls to the `depict` method of the default Siren deploy at https://api.chemicalfingerprint.siren.io. If you want to use your own deployed version of the API change the base URL directly in the UI:
Go to Management => Indexes and Relations => chembl-molecules => fields. Search for the `canonical-smiles` field and edit the value of the URL template that is used to retrieve these molecular structures.
