var express = require('express');
var cors = require('cors');
var app = express();
var sql = require("mssql");

app.use(cors());

// config for your database
var config = {
    user: 'andrewdavidcoleman',
    password: 'Container22@@',
    server: 'andrew-dev.database.windows.net', 
    database: 'andrew-dev' 
};

// get all movies
app.get('/', function (req, res) {

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query('select * from Rewatchables', function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset);
            
        });
    });
});

// upsert
app.post('/upsert', function (req, res) {
  
  const params = req.query;
  
  // connect to your database
  sql.connect(config, function (err) {
  
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();

      const query = params.id ? 
      `
        update Rewatchables set 
        name = '${params.name}',
        andrew = ${params.andrew},
        caleb = ${params.caleb}
        where id = ${params.id}
      ` : 
      `
        insert into Rewatchables (name, andrew, caleb) 
        values ('${params.name}', 0, 0)
      `
      
      // query to the database and get the records
      request.query(query, function (err, recordset) {
          
        if (err) console.log(err)
        console.log(recordset);
        // send records as a response
        res.send(recordset);
          
      });
  });
});

// delete
app.post('/delete', function (req, res) {

  const params = req.params;

  // connect to your database
  sql.connect(config, function (err) {
  
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();
         
      // query to the database and get the records
      request.query(`
        delete from Rewatchables
        where id = ${params.id}
      `, function (err, recordset) {
          
          if (err) console.log(err)

          // send records as a response
          res.send(recordset);
          
      });
  });
});

var server = app.listen(7000, function () {
    console.log('Server is running..');
});