#!/usr/bin/env figure use -f

var app, controllers, models, views, helpers, utils

app         = new Figure('app');
controllers = new Figure('controllers');
models      = new Figure('models');
views       = new Figure('views');
helpers     = new Figure('helpers');
utils       = new Figure('utils');

controllers
  .shares(helpers)
  .shares(utils);

models
  .shares(helpers)
  .shares(utils);

views
  .shares(helpers)
  .shares(utils);

app
  .owns(controllers)
  .owns(models)
  .owns(views)
  .shares(helpers)
  .shares(utils);

app.create(function(err){
  if (err) {
    throw err;
  }

  // do something
});