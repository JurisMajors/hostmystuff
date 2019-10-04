![CircleCI](https://circleci.com/gh/JurisMajors/hostmystuff.svg?style=shield)](https://circleci.com/gh/JurisMajors/hostmystuff)
[![Known Vulnerabilities](https://snyk.io//test/github/JurisMajors/hostmystuff/badge.svg?targetFile=package.json)](https://snyk.io//test/github/JurisMajors/hostmystuff?targetFile=package.json)
[![DeepScan grade](https://deepscan.io/api/teams/5550/projects/7391/branches/73694/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5550&pid=7391&bid=73694)



[Hostmystuff](https://www.hostmystuff.xyz/) is a simple private file-hosting service written in JS, using NodeJS and deployed in Docker.

It supports syntax highlighting by using [highlight.js](https://highlightjs.org/) and authentication is based through digitally signing the files that are uploaded.

The homepage contains more detailed information, including
* How to upload
    * see `scripts/test-upload.sh`
    * Or also my [personal upload script](https://github.com/JurisMajors/dotfiles/blob/master/bin/upload)
* Preferred ways to transfer gpg-keys
* Enabling/disabling syntax highlighting

# Running 
Hostmystuff runs within docker/docker-compose, therefore make sure you have it installed.
## Development mode
Development mode is recommended since it disables the digital signature authentication.
Make sure you have run `npm install` to install the dependencies.
For development mode, there is a nodejs run-time argument `dev`.

If want to run w/o docker, then `node app.js dev` 

If want to run in docker, then first build the container `docker-compose build` and run it with `docker-compose -f dev-compose.yml up -d`.
The `dev-compose.yml` specifies to run node in development mode.

Both methods will serve the website on `localhost:8080` and you can use `scripts/test-dev-upload.sh` for file uploading.

## Production mode
If you are running without docker `node app.js`, then the authorized keys must be added to ur personal gpg key-ring.

If running in docker then make sure, that you have defined an `scripts/authorizedKeys` file as discussed in Adding keys section.
Running `docker-compose up --build -d` will build and serve the website on `localhost:8080`

# Adding keys

In the `scripts/` directory, the file `authorizedKeys` defines all the gpg keyID's that are authorized to upload.
Each new key should be in a seperate line. If no keyserver is provided keys.openpgp.org is used.
Example key file:
```
pubKeyID1
pubKeyID2 somekeyserver.com
```
pubKeyID1 will be fetched from keys.openpgp.org and pubKeyID2 from somekeyserver.com

If you want to have access to hostmystuff, you must provide me with the key information personally.
Identities of these key owners must be verified.

# TODO
Feedback and requested features are always welcome!

# DONE
- [x] CI/CD
- [x] Automatic gpg key addition from a file on deployment (need CI/CD first)
- [x] Syntax highlighting
- [x] Digital signature based authentication
- [x] Dockerize
