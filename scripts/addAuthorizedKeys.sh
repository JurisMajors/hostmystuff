#!/bin/bash

KEYFILE="$(realpath authorizedKeys)";

while IFS= read -r keyInfo
do
    keyInfoArr=( $keyInfo );
    keyServer="keys.openpgp.org";
    if [ "${keyInfoArr[1]}" ] 
    then
        keyServer="${keyInfoArr[1]}";
    fi
    if [ -z "${keyInfoArr[0]}" ] 
    then
        echo "[WARNING] authorizedKeys has an empty line. Possibly missing a keyID."
    else
        $(gpg --keyserver $keyServer --recv-keys ${keyInfoArr[0]});
    fi
done < "$KEYFILE"
