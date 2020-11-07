## Overview

Set of tools to jump start playing with node.js, typescript and mongodb.

## Running scripts

Node can run typescript files directly if invoked with an argument: `-t 'ts-node/register'`.

### Run via command line
Most straightforward way to run a typescript file is via command line:
```
node -t 'ts-node/register' packages/scripts/script-example.ts
```

### Run via VSCode hotkey

```json
{
    "key": "ctrl+r k",
    "command": "runInTerminal.run",
    "args": {"match": "\\.js$", "cmd": "node ${file}"},
    "when": "resourceLangId == javascript"
},
{
    "key": "ctrl+r k",
    "command": "runInTerminal.run",
    "args": {"match": "\\.ts$", "cmd": "node -r 'ts-node/register' ${file}"},
    "when": "resourceLangId == typescript"

},
```

## Run via VSCode debug

Default VSCode debug configurations can be set per user in `~/.config/vscode/User/settings.json` file.
```json
{
    "name": "Debug TS file",
    "type": "node",
    "request": "launch",
    "args": [
        "${file}"
    ],
    "runtimeArgs": [
        "-r",
        "ts-node/register"
    ],
    "skipFiles": [
        "<node_internals>/**/*.js"
    ],
    "sourceMaps": true,
    "protocol": "inspector",
},
{
    "type": "node",
    "request": "launch",
    "name": "Debug node.js file",
    "program": "${file}",
    "skipFiles": [
        "<node_internals>/**",
        "lib/instrumentation/**",
        "newrelic/lib/**"
    ],
    "runtimeArgs": [
        "-r",
        "module-alias/register",
    ],
    "env": {
        "NODE_ENV": "dev",
    }
},
```
