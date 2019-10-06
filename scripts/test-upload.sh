if [ -z "$1" ]
then
    echo "Uploading the script itself"
    FILE="./test-dev-upload.sh"
else
    echo "Uploading $1"
    FILE="$1"
fi
LINK=$(curl --header "key: api-key" -F"file=@$FILE" https://hostmystuff.xyz/)
echo "$LINK"
