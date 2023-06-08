#!/bin/bash -eu

tools=()
while IFS='' read -r line; do tools+=("$line"); done < <(sed -En 's/[[:space:]]+_ "(.*)"/\1/p' tools/tools.go)

pushd tools

echo "install go tools"
for tool in "${tools[@]}"
do
  echo " - $tool"
  go install "$tool"
done

popd tools
