TMPFILE='/tmp/test-upload.tmp';
SIGNATURE=$(gpg --sign --output $TMPFILE './test.json');
LINK=$(curl -F"file=@$TMPFILE" localhost:8080)
$(rm $TMPFILE)

echo "$LINK"
