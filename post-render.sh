#!/bin/bash
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" || -n "$COMSPEC" ]]; then
    copy /Y "javascript\\quarto_listing.js" "_site\\site_libs\\quarto-listing\\quarto-listing.js"
else
    cp "javascript/quarto_listing.js" "_site/site_libs/quarto-listing/quarto-listing.js"
fi
