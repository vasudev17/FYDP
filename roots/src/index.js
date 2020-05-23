const express = require('express');
const { Pool, Client } = require('pg');
const bodyParser = require('body-parser');

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});
client.connect();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/plant', (req, res) => {
  client.query('SELECT * FROM plants', (err, client_res) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Response received: ", client_res);
      res.json(client_res);
    }
  });
});


app.post('/plant', (req, res) => {
  console.log("Received request body: ", req.body);
  if (req.body) {
    const ph = req.body.ph ? parseFloat(req.body.ph) :null;
    const moisture = req.body.moisture ? parseFloat(req.body.moisture) : null;

    if (!ph || !moisture) {
      res.json({ 
        "Message": "Required fields not provided.",
        ph,
        moisture,
      });
      return;
    }
    const column_alias = 'delta';

//using the formula in report
const query_string =
      `SELECT *, ((0.3*(moisture - ${moisture})^2) + 0.7*(avg_ph - ${ph})^2)as ${column_alias} FROM plants `
    + ` WHERE ${ph} >= minimum_ph AND ${ph} <= maximum_ph`
    + ` ORDER BY ${column_alias} ASC LIMIT 1;`;

    client.query(query_string, (err, client_res) => {
      if (err) {
        console.error(err);
        res.json({ err });
      } else {
        const data = client_res && client_res.rows ? client_res.rows[0] : null;
        if (data) {
          res.json(data);
          console.log(data);
        } else {
          res.json({ "Message" : "No suitable vegetables were found for this soil pH value." });
        }
      }
    });
  } else {
    res.json({ "Message": "No request body found." });
  }
});

app.post('/recommendation', (req, res) => {
  console.log("Received request body: ", req.body);
  if (req.body) {
    const id = req.body.id ? parseFloat(req.body.id) :null;


    console.log(id);
    if (!id) {
      console.log(id);
      res.json({ 
        "Message": "Required fields not provided.",
        id
      });
      return;
    }

const query_string =
      `SELECT common_name,fertilizer_ratio, n_p_k FROM plants `
    + ` WHERE ${id} = id;`;

    client.query(query_string, (err, client_res) => {
      if (err) {
        console.error(err);
        res.json({ err });
      } else {
        const data = client_res && client_res.rows ? client_res.rows[0] : null;
        if (data) {
          res.json(data);
          console.log(data);
        } else {
          res.json({ "Message" : "No suitable vegetables were found for this soil pH value." });
        }
      }
    });
  } else {
    res.json({ "Message": "No request body found." });
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));