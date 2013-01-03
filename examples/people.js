var people, sally, frank, jim, sarah, children, hobbies


children = [
  new Figure('Sarah', ['Sammy', 'Hank']), 
  'John', 
  'Billy'
];

sally    = new Figure('Sally', children);



frank    = new Figure('Frank', children);
jim      = new Figure('Jim');
people   = new Figure('People', [sally, frank, jim]);

//console.log(people.get('Sally'))
