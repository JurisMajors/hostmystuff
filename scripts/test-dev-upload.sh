if [ -z "$1" ]
then
    echo "Uploading the script itself"
    FILE="./test-dev-upload.sh"
else
    echo "Uploading $1"
    FILE="$1"
fi
LINK=$(curl --header "key: f774c1e3-5044-4a4c-a049-c38f0e20e885" -F"file=@$FILE" localhost:8080)
echo "$LINK"
