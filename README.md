[Hostmystuff](https://www.hostmystuff.ml/) is a simple private file-hosting service written in JS, using NodeJS.

It supports syntax highlighting by using [code-prettify](https://github.com/google/code-prettify) and authentication is based through digitally signing the files that are uploaded.

The homepage contains more detailed information, including
* How to upload
    * see `scripts/test-upload.sh`
    * Or also my [personal upload script](https://github.com/JurisMajors/dotfiles/blob/master/bin/upload)
* Preferred ways to transfer gpg-keys
* Enabling/disabling syntax highlighting

# Running 
Hostmystuff runs within docker, therefore make sure you have it installed.
First build the container `docker build -t hostmystuff .`
Then run the container `docker run -p 8080:8080 -d hostmystuff`
Hostmystuff is now served on `localhost:8080`

# TODO
- [ ] CI/CD
- [ ] Automatic gpg key addition from a file on deployment (need CI/CD first)
- [ ] Dockerize

# DONE
- [x] Syntax highlighting
- [x] Digital signature based authentication
