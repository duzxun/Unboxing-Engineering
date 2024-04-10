#!/bin/bash
for zip_file in *.zip; do
    # Check if the current item is a file
    if [[ -f $zip_file ]]; then
        # Extract the filename without extension
        filename=$(basename "$zip_file" .zip)
        
        # Strip from the start of the name up to and including the first space character
        stripped_name="${filename#* }"
        fnew=${zip_file::-4}
        fnew=${filename// /}
        # echo "Stripped name for $zip_file: $stripped_name"
	mkdir "$stripped_name"

	unzip "$zip_file"

	python3 test.py "$fnew.html" "$stripped_name"

        mv images "$stripped_name"
    fi
done
