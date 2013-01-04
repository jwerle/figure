#!/usr/bin/env figure use -f

var people, sally, frank, jim, sarah, children, hobbies
children = ['John', 'Billy'];

people   = new Figure('People');
sarah    = new Figure('Sarah', ['Sammy', 'Hank']);
jim      = new Figure('Jim', false, people);
sally    = new Figure('Sally', children, people);
frank    = new Figure('Frank', children, people);

sally.shares(sarah);
frank.shares(sarah);

people.create(function(err){
  if (err){
    throw err;
  }

  console.log('people made');
});