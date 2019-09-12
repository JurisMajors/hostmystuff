[Hostmystuff](https://www.hostmystuff.ml/) is a simple private file-hosting service written in JS, using NodeJS.

It supports syntax highlighting by using [code-prettify](https://github.com/google/code-prettify) and authentication is based through digitally signing the files that are uploaded.

It is simple to get it up and running just run `npm install` and then `node app.js`.

The homepage contains more detailed information, including
* How to upload
    * see [`test-upload.sh`](https://github.com/JurisMajors/hostmystuff/blob/master/test-upload.sh)
    * Or also my [personal upload script](https://github.com/JurisMajors/dotfiles/blob/master/bin/upload)
* Preferred ways to transfer gpg-keys
* Enabling/disabling syntax highlighting

# TODO
[ ] CI/CD
[ ] Automatic gpg key addition from a file on deployment (need CI/CD first)
[ ] Dockerize

# DONE
[x] Syntax highlighting
[x] Digital signature based authentication
