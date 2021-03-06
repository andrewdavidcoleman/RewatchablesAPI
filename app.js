const express = require('express');
const cors = require('cors');
const app = express();
const sql = require("mssql");
const port = process.env.PORT || 3000

app.use(cors());

// config for your database
const config = {
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
        const request = new sql.Request();
           
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
      const request = new sql.Request();

      const query = params.id ? 
      `
        update Rewatchables set 
        name = '${params.name}',
        andrew = ${params.andrew ? 1 : 0},
        caleb = ${params.caleb ? 1 : 0}
        where id = ${params.id}
      ` : 
      `
        insert into Rewatchables (name, andrew, caleb) 
        values ('${params.name}', 0, 0)
      `
      
      // query to the database and get the records
      request.query(query, function (err, recordset) {
          
        if (err) console.log(err)
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

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})