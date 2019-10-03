if [ -z "$1" ]
then
    echo "Uploading the script itself"
    FILE="./test-dev-upload.sh"
else
    echo "Uploading $1"
    FILE="$1"
fi
TMPFILE='/tmp/test-upload.tmp';
SIGNATURE=$(gpg --sign --output $TMPFILE $FILE);
LINK=$(curl -F"file=@$TMPFILE" localhost:8080)
$(rm $TMPFILE)

echo "$LINK"
