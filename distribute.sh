#!/bin/zsh

rm -rf build/ build.prod/ || exit 1
npm run build || exit 1

rm -rf build.uglified/ || exit 1
npm run uglify || exit 1

rm -rf distribute/hehebot || exit 1
mkdir -p distribute/hehebot || exit 1

cp -r build.uglified distribute/hehebot/build || exit 1
cp package.json distribute/hehebot || exit 1
cp package-lock.json distribute/hehebot || exit 1
cp README.md distribute/hehebot || exit 1
cp -r views distribute/hehebot || exit 1

cd distribute || exit 1
cp config.json hehebot/build || exit 1

rm -rf hehebot.zip || exit 1
zip -vr hehebot.zip hehebot/ -x "*.DS_Store" || exit 1

ssh marsgpl 'mkdir -p /var/www/marsgpl.com/etc' || exit 1
rsync -rv hehebot.zip marsgpl:/var/www/marsgpl.com/etc/hehebot.zip || exit 1
