#!/bin/bash
zip -r ../${PWD##*/}.nw *
rm -Rfv ../Taxidermy.app
cp -Rf ~/Projects/node-webkit-v0.5.1-osx-ia32/node-webkit.app ../Taxidermy.app
mv ../${PWD##*/}.nw ../Taxidermy.app/Contents/Resources/app.nw