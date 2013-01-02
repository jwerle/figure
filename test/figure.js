var figure = require('../')
  , assert = require('assert')
  , bin    = require('../bin/figure')

var fig, children, success, figDestroyed, figCreated, puts, fail, die

// Borrowed from the bin executable
puts  = bin.puts;
warn  = bin.warn;
fail = bin.fail;
die   = bin.die;

// Success callback
success = function() {
  // Test OK
  console.log("Test passed ok");
  // Leave
  process.exit();
};

// Checks if figure is created
figCreated = function(err, dir){
  // Was it really created?
  assert.ok(figure.Figure.isFigure(dir || this.directory || false), "Figure was not removed");
}

// Checks if figure is trashed
figDestroyed = function(err, dir){
  // Was it really removed?
  assert.ok(!figure.Figure.isFigure(dir || this.directory || false), "Figure was not removed");
}

puts
  ("Starting figure test");

// Test a lone figure
fig = new figure.Figure('test/soldier');

// Make sure it was created properly
assert.ok(fig instanceof figure.Figure, "Something went wrong while creating a figure");

puts
  ("Lone figure instantiated");

warn
  ("Attempting to create");

// Attempt to create;
fig.create(function(){
  // Was it really created?
  figCreated(null, 'test/soldier');

  puts
    ("Lone figure created");

  warn
    ("Attempting to trash it");

  // Trash it
  fig.remove(function(err){
    if (err) {
      warn
        ("Error trashing figure");

      throw err;
    }

    // Was it really removed?
    figDestroyed.call(this);

    puts
      ("Lone figure removed");

    // Test a figure with three children
    fig = new figure.Figure('test/people', ['john', 'sally', 'frank']);

    // Make sure it was created properly
    assert.ok(fig instanceof figure.Figure, "Something went wrong while creating a figure");

    puts
      ("Figure with three children instantiated.");

    warn
      ("Attempting to create");

    // Attempt to create
    fig.create(function(){

      // Test parent
      assert.ok(figure.Figure.isFigure('test/people'), "Figure people was not created");

      puts
        ("Figure with three children created");

      // Test children
      assert.ok(figure.Figure.isFigure('test/people/john'), "Figure people/john was not created");
      assert.ok(figure.Figure.isFigure('test/people/sally'), "Figure people/sally was not created");
      assert.ok(figure.Figure.isFigure('test/people/frank'), "Figure people/frank was not created");

      puts
        ("All children OK");

      warn
        ("Attempting to trash all three children. Parent figure will remain intact");

      // Trash children
      fig.children.get('john').remove(figDestroyed);
      fig.children.get('sally').remove(figDestroyed);
      fig.children.get('frank').remove(function(){
        figDestroyed.call(this);

        puts
          ("Figure children removed");

        warn
          ("Attempting to remove parent figure");

        // Trash parent
        fig.remove(function(err){
          if (err) {
            throw err;
          }

          // Was it really removed?
          figDestroyed.call(this);

          // Test a figure with nested children
          fig = new figure.Figure('test/company', [
            'executives', 
            'management', 
            'directors[product,project]', 
            'managers',
            'workers',
            'operations', 
            'clients[consumers,partners,traders[national,international]]'
          ]);

          // Make sure it was created properly
          assert.ok(fig instanceof figure.Figure, "Something went wrong while creating a figure");

          fig.create(function(){
            // Test parent
            assert.ok(figure.Figure.isFigure('test/company'), "Figure company was not created");

            // Assert direct descendants of parent
            assert.ok(figure.Figure.isFigure('test/company/executives'), "Figure company/executives was not created");
            assert.ok(figure.Figure.isFigure('test/company/management'), "Figure company/management was not created");
            assert.ok(figure.Figure.isFigure('test/company/directors'), "Figure company/directors was not created");
              assert.ok(figure.Figure.isFigure('test/company/directors/product'), "Figure company/directors/product was not created");
              assert.ok(figure.Figure.isFigure('test/company/directors/project'), "Figure company/directors/project was not created");


            assert.ok(figure.Figure.isFigure('test/company/managers'), "Figure company/managers was not created");
            assert.ok(figure.Figure.isFigure('test/company/workers'), "Figure company/workers was not created");
            assert.ok(figure.Figure.isFigure('test/company/operations'), "Figure company/operations was not created");
            assert.ok(figure.Figure.isFigure('test/company/clients'), "Figure company/clients was not created");
              assert.ok(figure.Figure.isFigure('test/company/clients/consumers'), "Figure company/clients/consumers was not created");
              assert.ok(figure.Figure.isFigure('test/company/clients/partners'), "Figure company/clients/partners was not created");
              assert.ok(figure.Figure.isFigure('test/company/clients/traders'), "Figure company/clients/traders was not created");

            warn
              ("Attempting to remove parent figure");

            // Trash parent
            fig.remove(function(err){
              if (err) {
                warn
                  ("Something went wrong removing parent");

                throw err;
              }

              success();
            });
          });
        });
      });
    });
  });
});