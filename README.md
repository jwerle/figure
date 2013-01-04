figure(1)
======

a simple tool for creating and managing directory models

[![Build Status](https://travis-ci.org/jwerle/figure.png)](https://travis-ci.org/jwerle/figure)

## introduction
`figure` is a command-line executable and Node module. It can be used to create and manage directories, or what shall be referred to as
figures. You can use it to create, remove, and get info about a figure structure.

## requirements
figure writes code to `index.js` in each figure that requires [node-auto-loader](https://github.com/jwerle/node-auto-loader) to be installed globally.
```sh
$ [sudo] npm install -g auto-loader
```

## install
```sh
$ [sudo] npm install -g figure
```

## Uusage
figures can be managed from Node or the command line.
```sh
$ figure [create|remove|use|check] [-f] --file [-d] --directory [-n] name

...

$ figure create -n app -c controllers[utils],models,view[helpers]
$  $ tree app/
app/
├── controllers
│   ├── index.js
│   └── utils
│       └── index.js
├── index.js
├── models
│   └── index.js
└── view
    ├── helpers
    │   └── index.js
    └── index.js

5 directories, 6 files

...

$ figure remove -n app
...
figure> Removing figure app

...

$ figure use -f ./examples/application.js
$ cd examples/
 $ tree app
app
├── controllers
│   ├── helpers
│   │   └── index.js
│   ├── index.js
│   └── utils
│       └── index.js
├── helpers
│   └── index.js
├── index.js
├── models
│   ├── helpers
│   │   └── index.js
│   ├── index.js
│   └── utils
│       └── index.js
├── utils
│   └── index.js
└── views
    ├── helpers
    │   └── index.js
    ├── index.js
    └── utils
        └── index.js

11 directories, 12 files

...

$ figure check -d app/
figure> Using figure v0.0.9
figure> Using engine(s) node/>= 0.6
figure> app is a valid figure directory.
...
$ figure check -d figures/
figure> Using figure v0.0.9
figure> Using engine(s) node/>= 0.6
figure> FIGURES IS NOT A VALID FIGURE.

```
```js
var Figure   = require('figure').Figure
  ...

var figure = new Figure(directory, [childFigures], parentFigure);

// create
figure.create(callback);

// remove
figure.remove(callback);

// use a file
figure.use(filePath);

// check figure directory
Figure.isFigure(directoryPath);
```

### creating/adding child figures
if the parent figure exists and the children do not, then the children are created.
node:
```js
var people = new figure.Figure('figures/people', ['john', 'sally', 'frank']);
people.create(function(err){
  // do something here
});
```
Command-line:
```sh
$ cd figures/
$ figure create -n people -c john,sally,frank
...

figure> Creating figure people
$ tree people/
people/
├── frank
│   └── index.js
├── index.js
├── john
│   └── index.js
└── sally
    └── index.js

3 directories, 4 files
```

## api
* Figure(directory, [childFigures], parentFigure) 
* create - Creates the figure directory structure.

## Issues
Found a bug?
[Email](mailto:joseph@werle.io) or [submit](https://github.com/jwerle/figure/issues) all issues


Copyright and license
---------------------

Copyright 2012

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

- - -
figure(1) - copyright 2012 - joseph.werle@gmail.com