var figure = require('../')
  , assert = require('assert')
  , bin    = require('../bin/figure')

var fig, children, success, wasFigureDestroyed, wasFigureCreated, puts, fail, die

// Borrowed from the bin executable
puts  = bin.puts;
warn  = bin.warn;
fail  = bin.fail;
die   = bin.die;

// Success callback
success = function() {
  // Test OK
  puts
    ("Test OK".blue);

  // Leave
  process.exit();
};

// Checks if figure is created
wasFigureCreated = function(err, dir) {
  if (err) {
    warn (err.toString());
    throw err;
  }

  // Was it really created?
  assert.ok(figure.Figure.isFigure(dir || this.directory || false), "Figure was not removed");

  warn ("Figure created")
}

// Checks if figure is trashed
wasFigureDestroyed = function(err, dir) {
  if (err) {
    warn (err.toString());
    throw err;
  }

  // Was it really removed?
  assert.ok(!figure.Figure.isFigure(dir || this.directory || false), "Figure was not removed");

  warn ("Figure destroyed")
}

puts
  ("Starting figure test");

// Test a lone figure
fig = new figure.Figure('tmp/soldier');

// Make sure it was created properly
assert.ok(fig instanceof figure.Figure, "Something went wrong while creating a figure");

puts
  ("Lone figure instantiated");

warn
  ("Attempting to create");

// Attempt to create;
fig.create(function(){
  // Was it really created?
  wasFigureCreated(null, 'tmp/soldier');

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
    wasFigureDestroyed.call(this);

    puts
      ("Lone figure removed");

    // Test a figure with three children
    fig = new figure.Figure('tmp/people', ['john', 'sally', 'frank']);

    // Make sure it was created properly
    assert.ok(fig instanceof figure.Figure, 
      "Something went wrong while creating a figure");

    puts
      ("Figure with three children instantiated.");

    warn
      ("Attempting to create");

    // Attempt to create
    fig.create(function(){

      // Test parent
      assert.ok(figure.Figure.isFigure('tmp/people'), 
        "Figure people was not created");

      puts
        ("Figure with three children created");

      // Test children
      assert.ok(figure.Figure.isFigure('tmp/people/john'), 
        "Figure people/john was not created");
      assert.ok(figure.Figure.isFigure('tmp/people/sally'), 
        "Figure people/sally was not created");
      assert.ok(figure.Figure.isFigure('tmp/people/frank'), 
        "Figure people/frank was not created");

      puts
        ("All children OK");

      warn
        ("Attempting to trash all three children. Parent figure will remain intact");

      // Trash children
      fig.children.get('john').remove(wasFigureDestroyed);
      fig.children.get('sally').remove(wasFigureDestroyed);
      fig.children.get('frank').remove(function(){
        wasFigureDestroyed.call(this);

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
          wasFigureDestroyed.call(this);

          // Test a figure with nested children
          fig = new figure.Figure('tmp/company', [
            'executives', 
            'management', 
            'directors[product,project]', 
            'managers',
            'workers',
            'operations', 
            'clients[consumers,partners,traders[national,international]]'
          ]);

          // Make sure it was created properly
          assert.ok(fig instanceof figure.Figure, 
            "Something went wrong while creating a figure");

          fig.create(function(){
            // Test parent
            assert.ok(figure.Figure.isFigure('tmp/company'), 
              "Figure company was not created");

            // Assert direct descendants of parent
            assert.ok(figure.Figure.isFigure('tmp/company/executives'), 
              "Figure company/executives was not created");
            assert.ok(figure.Figure.isFigure('tmp/company/management'), 
              "Figure company/management was not created");
            assert.ok(figure.Figure.isFigure('tmp/company/directors'), 
              "Figure company/directors was not created");
              assert.ok(figure.Figure.isFigure('tmp/company/directors/product'), 
                "Figure company/directors/product was not created");
              assert.ok(figure.Figure.isFigure('tmp/company/directors/project'), 
                "Figure company/directors/project was not created");

            assert.ok(figure.Figure.isFigure('tmp/company/managers'), 
              "Figure company/managers was not created");
            assert.ok(figure.Figure.isFigure('tmp/company/workers'), 
              "Figure company/workers was not created");
            assert.ok(figure.Figure.isFigure('tmp/company/operations'), 
              "Figure company/operations was not created");
            assert.ok(figure.Figure.isFigure('tmp/company/clients'), 
              "Figure company/clients was not created");
              assert.ok(figure.Figure.isFigure('tmp/company/clients/consumers'), 
                "Figure company/clients/consumers was not created");
              assert.ok(figure.Figure.isFigure('tmp/company/clients/partners'), 
                "Figure company/clients/partners was not created");
              assert.ok(figure.Figure.isFigure('tmp/company/clients/traders'), 
                "Figure company/clients/traders was not created");
                assert.ok(figure.Figure.isFigure('tmp/company/clients/traders/national'), 
                  "Figure company/clients/traders/national was not created");
                assert.ok(figure.Figure.isFigure('tmp/company/clients/traders/international'), 
                  "Figure company/clients/traders/international was not created");

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