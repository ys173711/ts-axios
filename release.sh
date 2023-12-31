#!/usr/bin/env sh # 表示shell脚本
set -e
echo "Enter release version: "
read VERSION
read -p "Releasing $VERSION - are you sure?(y/n)" -n 1 -r
echo # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."

  # git commit
  git add -A
  git commit -m "[build] $VERSION"
  npm version $VERSION --message "[release] $VERSION"
  git push origin main

  # publish
  npm publish
fi