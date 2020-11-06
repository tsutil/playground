## Install node.js

```sh
# install node.js
# https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs

echo "running as $USER"
sudo chown $USER -R /usr/local

mkdir /usr/local/src
echo 'Common open source libraries' > /usr/local/src/readme.md

# this will create $HOME/.npmrc configuration file with prefix=/usr/local
# global packages will be installed to /usr/local/lib/node_modules
# binaries from global packages will be available in /usr/local/bin
npm config set prefix /usr/local
```

## Recommended global packages

Runtime:
- pm2
- ts-node
- typescript
- module-alias

Application/webpage Packaging:
- pkg
- nativefier
- webpack

Development tools:
- live-server

Package management:
- lerna
- yarn
