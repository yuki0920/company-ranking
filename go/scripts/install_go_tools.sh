#!/bin/bash -eu

echo "Installing go tools..."
echo "to GOBIN: $(go env GOBIN)"

tools=()
while IFS='' read -r line; do tools+=("$line"); done < <(sed -En 's/[[:space:]]+_ "(.*)"/\1/p' tools/tools.go)

pushd tools

echo "install go tools"
for tool in "${tools[@]}"
do
  echo " - $tool"
  go install "$tool"
done

popd
