figure(1)
======

A simple tool for creating and managing directory models

[![Build Status](https://travis-ci.org/jwerle/figure.png)](https://travis-ci.org/jwerle/figure)

## Introduction
`figure` is a command-line executable and a Node module. It can be used to create and manage directories, or what shall be referred to as
figures. You can use it to create, remove, get info about a figure structure

## Install
```sh
$ [sudo] npm install -g figure
```

## Usage
Node:
```js
var figure = require('figure');

// Create a figure module from node
var soldier = new figure.Figure('figures/soldier');
soldier.create();
```
Command-line:
```sh
$ cd figures/
$ figure create -n soldier
figure> Using figure v0.0.5
figure> Using engine(s) node/>= 0.6
figure> Using path /Users/werle/repos/figure/figures
figure> Destination /Users/werle/repos/figure/figures/soldier
figure> Creating figure soldier
$ cd soldier/
```

### Child figures
Node:
```js
var people = new figure.Figure('figures/people', ['john', 'sally', 'frank']);
people.create();
```
Command-line:
```sh
$ cd figures/
$ figure create -n people -c john,sally,frank
figure> Using figure v0.0.6
figure> Using engine(s) node/>= 0.6
figure> Using children
figure> Using path /Users/werle/repos/figure/figures/
figure> Destination /Users/werle/repos/figure/figures/people
figure> Creating figure people
$ cd people
```

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