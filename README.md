[![CircleCI](https://circleci.com/gh/JurisMajors/hostmystuff/tree/master.svg?style=svg)](https://circleci.com/gh/JurisMajors/hostmystuff/tree/master)
[![Known Vulnerabilities](https://snyk.io//test/github/JurisMajors/hostmystuff/badge.svg?targetFile=package.json)](https://snyk.io//test/github/JurisMajors/hostmystuff?targetFile=package.json)
[![DeepScan grade](https://deepscan.io/api/teams/5550/projects/7391/branches/73694/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5550&pid=7391&bid=73694)



[Hostmystuff](https://www.hostmystuff.xyz/) is a simple private file-hosting service written in JS, using NodeJS and deployed in Docker.

It supports syntax highlighting by using [code-prettify](https://github.com/google/code-prettify) and authentication is based through digitally signing the files that are uploaded.

The homepage contains more detailed information, including
* How to upload
    * see `scripts/test-upload.sh`
    * Or also my [personal upload script](https://github.com/JurisMajors/dotfiles/blob/master/bin/upload)
* Preferred ways to transfer gpg-keys
* Enabling/disabling syntax highlighting

# Running 
Hostmystuff runs within docker/docker-compose, therefore make sure you have it installed.

Running `docker-compose up --build -d` will build and serve the website on `localhost:8080`

# Add keys

In the `scripts/` directory, the file `authorizedKeys` defines all the gpg keyID's that are authorized to upload.

Each new key should be in a seperate line. If no keyserver is provided keys.openpgp.org is used.
If you want to have access to hostmystuff, you must make a PR that adds your key or send the information to me as PM.

# TODO

# DONE
- [x] CI/CD
- [x] Automatic gpg key addition from a file on deployment (need CI/CD first)
- [x] Syntax highlighting
- [x] Digital signature based authentication
- [x] Dockerize
