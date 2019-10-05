if [ -z "$1" ]
then
    echo "Uploading the script itself"
    FILE="./test-dev-upload.sh"
else
    echo "Uploading $1"
    FILE="$1"
fi
LINK=$(curl --header "key: f0d2e948-dd36-43da-9a64-56bb15369522" -F"file=@$FILE" localhost:8080)
echo "$LINK"
