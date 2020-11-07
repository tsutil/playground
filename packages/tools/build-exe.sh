#!/usr/bin/env sh
script_directory=`dirname "$(readlink -f "$0")"`
file="$script_directory/src/$1.js"
out=`realpath "$script_directory/../../../bin/$1"`
pkg -t node12-linux $file -o $out
echo $out
