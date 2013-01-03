var figure = require('../')
  , assert = require('assert')
  , bin    = require('../bin/figure')
  , path   = require('path')

var fig, children, success, wasFigureDestroyed, wasFigureCreated, puts, fail, die

// Borrowed from the bin executable
puts  = bin.puts;
warn  = bin.warn;
fail  = bin.fail;
die   = bin.die;

// Success callback
success = function() {
  // Test OK
  void puts
    ("Test OK".blue);

  // Leave
  process.exit();
};

// Checks if figure is created
wasFigureCreated = function(err, dir) {
  if (err) {
    void warn (err.toString());
    throw err;
  }
  // Was it really created?
  assert.ok(figure.Figure.isFigure(dir || (this.getDirectory && this.getDirectory()) || false), "Figure was not removed");

  void warn ("Figure created")
}

// Checks if figure is trashed
wasFigureDestroyed = function(err, dir) {
  if (err) {
    void warn (err.toString());
    throw err;
  }

  // Was it really removed?
  assert.ok(!figure.Figure.isFigure(dir || (this.getDirectory && this.getDirectory()) || false), "Figure was not removed");

  void warn ("Figure destroyed")
}

process.chdir(path.resolve(__dirname, '../tmp'));

void puts ("Starting figure test")
          ("Working directory " + process.cwd().green);


// Test a lone figure
fig = new figure.Figure('soldier');

// Make sure it was created properly
assert.ok(fig instanceof figure.Figure, "Something went wrong while creating a figure");

void puts ("Lone figure instantiated") && 
     warn ("Attempting to create");

// Attempt to create;
fig.create(function(err){
  if (err) {
    void warn (err.toString())
    throw err
  }

  // Was it really created?
  wasFigureCreated(null, 'soldier');

  void puts ("Lone figure created") &&
       warn ("Attempting to trash it");

  // Trash it
  fig.remove(function(err){
    if (err) {
      void warn ("Error trashing figure");

      throw err;
    }

    // Was it really removed?
    wasFigureDestroyed.call(this);

    void puts ("Lone figure removed");

    // Test a figure with three children
    fig = new figure.Figure('people', ['john', 'sally', 'frank']);

    // Make sure it was created properly
    assert.ok(fig instanceof figure.Figure, 
      "Something went wrong while creating a figure");

    void puts ("Figure with three children instantiated.") && 
         warn ("Attempting to create");

    // Attempt to create
    fig.create(function(){

      // Test parent
      assert.ok(figure.Figure.isFigure(fig), 
        "Figure people was not created");

      void puts ("Figure with three children created");

      // Test children
      assert.ok(figure.Figure.isFigure(fig.get('john')), 
        "Figure people/john was not created");

      assert.ok(figure.Figure.isFigure(fig.get('sally')), 
        "Figure people/sally was not created");

      assert.ok(figure.Figure.isFigure(fig.get('frank')), 
        "Figure people/frank was not created");

      void puts ("All children OK") && 
           warn ("Attempting to trash all three children. Parent figure will remain intact");

      // Trash children
      fig.children.get('john').remove(wasFigureDestroyed);
      fig.children.get('sally').remove(wasFigureDestroyed);
      fig.children.get('frank').remove(function(){
        wasFigureDestroyed.call(this);

        void puts ("Figure children removed") &&
             warn ("Attempting to remove parent figure");

        // Trash parent
        fig.remove(function(err){
          if (err) {
            throw err;
          }

          // Was it really removed?
          wasFigureDestroyed.call(this);

          // Test a figure with nested children
          fig = new figure.Figure('company', [
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
            assert.ok(figure.Figure.isFigure(fig), 
              "Figure company was not created");

            // Assert direct descendants of parent
            assert.ok(figure.Figure.isFigure(fig.get('executives')),
              "Figure company/executives was not created");

            assert.ok(figure.Figure.isFigure(fig.get('management')),
              "Figure company/management was not created");

            assert.ok(figure.Figure.isFigure(fig.get('directors')),
              "Figure company/directors was not created");

              assert.ok(figure.Figure.isFigure(fig.get('directors').get('product')),
                "Figure company/directors/product was not created");

              assert.ok(figure.Figure.isFigure(fig.get('directors').get('project')),
                "Figure company/directors/project was not created");

            assert.ok(figure.Figure.isFigure(fig.get('managers')),
              "Figure company/managers was not created");

            assert.ok(figure.Figure.isFigure(fig.get('workers')),
              "Figure company/workers was not created");

            assert.ok(figure.Figure.isFigure(fig.get('operations')), 
              "Figure company/operations was not created");

            assert.ok(figure.Figure.isFigure(fig.get('clients')), 
              "Figure company/clients was not created");

              assert.ok(figure.Figure.isFigure(fig.get('clients').get('consumers')),
                "Figure company/clients/consumers was not created");

              assert.ok(figure.Figure.isFigure(fig.get('clients').get('partners')),
                "Figure company/clients/partners was not created");

              assert.ok(figure.Figure.isFigure(fig.get('clients').get('traders')),
                "Figure company/clients/traders was not created");

                assert.ok(figure.Figure.isFigure(fig.get('clients').get('traders').get('national')),
                  "Figure company/clients/traders/national was not created");

                assert.ok(figure.Figure.isFigure(fig.get('clients').get('traders').get('international')),
                  "Figure company/clients/traders/international was not created");

            void warn ("Attempting to remove parent figure");
            
            // Trash parent
            fig.remove(function(err){
              if (err) {
                void warn ("Something went wrong removing parent");

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