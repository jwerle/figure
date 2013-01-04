figure(1)
======

a simple tool for creating and managing directory models

[![Build Status](https://travis-ci.org/jwerle/figure.png)](https://travis-ci.org/jwerle/figure)

## introduction
`figure` is a command-line executable and Node module. 
It can be used to create and manage directories, or what shall be referred to as
figures. You can use it to create, remove, and get info about a figure structure.

## requirements
`figure(1)` writes javascript to `index.js` in each figure that is created. each requires [node-auto-loader](https://github.com/jwerle/node-auto-loader) to be installed globally.
```sh
$ [sudo] npm install -g auto-loader
```

## install
you are going to want this installed globally
```sh
$ [sudo] npm install -g figure
```

## api
figures can be managed from Node or the command line.
#### shell
```sh
$ figure [create|remove|use|check] [-f] --file [-d] --directory [-n] name
```
they can also be managed in nodejs
#### node
```js
var Figure = require('figure').Figure
var figure = new Figure(directory, [childFigures], parentFigure);
```

---

# create()
___

#### shell
accepts a name argument `-n <name>` and an optional children argument `-c [children,]`

```sh
$ figure create -n app -c controllers[utils],models,view[helpers]
$ tree app/
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
```
### node
accepts a callback function. if an error occurs, then it will be delegated to the callback.
```js
// create
figure.create(function(err){
    if (err) {
        throw err;
    }
    
    // do something here
});
```

---

# remove()
___

### shell
removes a valid figure directory
accepts a name argument `-n <name>`.
```sh
$ figure remove -n app
figure> Removing figure app

...
```
### node
accepts a callback function. if an error occurs, then it will be delegated to the callback.
```js
figure.remove(function(err){
    if (err) {
        throw err;
    }
    
    // do something here
});
```

---

# use()
___

### shell
accepts a `-f` filepath argument to execute as a node module. the figure module is global to the script.
```sh
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
```
### node
accepts a filepath argument to execute as a node module. the figure module is global to the script.
```js
figure.use(filepath);
```

---

# check()
___

### shell
accepts a `-d` directory filepath argument to validate as a Figure. exits with `code 1` if not valid
```sh
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
### node
accepts a directory filepath or Figure instance as an argument to validate as a valid Figure directory. returns `true` or `false`
```js
// returns 'true' or 'false'
Figure.isFigure('./figures/messages');
    // or
Figure.check('./figures/messages')
    // or
figure = new Figure('./figures/messages');
Figure.isFigure(figure); 
    // or
Figure.check(figure);
```

## creating/adding child figures
###### if the parent figure exists and the children do not, then the children are created.
### shell
* accepts a name argument `-n <name>` and an optional children argument `-c [children,]`

nested children can be achieved with `[]` brackets: 

`$ figure create -n app -c controllers[utils],models,view[helpers]` 

This will create a directory structure similar to the [one found in the examples](https://github.com/jwerle/figure/tree/master/examples/app) directory.
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
### node
accepts a directory path and an array of child figure names or Figure instances. the following structure would look like this after being created

```sh
people/
├── frank
│   └── index.js
├── index.js
├── john
│   └── index.js
└── sally
    └── index.js
```
```js
var people = new figure.Figure('figures/people', ['john', 'sally', 'frank']);
people.create(function(err){
  // do something here
});
```

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
