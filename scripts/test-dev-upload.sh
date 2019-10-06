if [ -z "$1" ]
then
    echo "Uploading the script itself"
    FILE="./test-dev-upload.sh"
else
    echo "Uploading $1"
    FILE="$1"
fi
LINK=$(curl --header "key: 695b20fc-fdf2-455b-91e3-4e301617a6bf" -F"file=@$FILE" localhost:8080)
echo "$LINK"
