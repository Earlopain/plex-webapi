# plex-webapi

Interact with the plex api via a logged in user or use a server directly with just the address

## Setup development enviroment

I use VSCode and push my build scripts and whatnot. If you use it too and clone this repo everything should work for you out of the box. For others you will have do adopt the script yourself.

If you want to run the demos you will need to modify it so that the user constructor gets called with email + password.

## Project structure
```
├── demo
├── dist
├── docs
├── node_modules
├── src
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

`demo` : Contains files I use for debugging or files you can use to see what you can do with this project
`dist` : Not in this repo, but if built will contain the javascript and map files used to run and debug
`docs` : Bits and pieces of the api I used and documented. Probably not complete whatsoever
`src` : The actual code written in typescript

## Running the tests

None yet