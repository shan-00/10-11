import pg from 'pg';
import express from 'express';
import bodyParser from 'body-parser';

const {Client} = pg;
const client = new Client({
    user:'postgres',
    host:'db',
    datsbase:'postgres',
    password:'12345',
    port:5432,
});

client.connect();

const createTable = async ()=>{
    await client.query(`CREATE TABLE IF NOT EXISTS users
    (id serial PRIMARY KEY,name VARCHAR (255) UNIQUE NOT NULL,
    email VARCHAR (255) UNIQUE NOT NULL,age INT NOT NULL);`)
};

createTable();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get('/api', (req, res) => {
    res.send('Hello Word!');
});

app.get('/api/all',async (req, res) => {
    try{
        const response = await client.query(`SELEC * FROM users`);
        if(response){
           res.status(200).send(response.row);
        }
    }
    catch (error){
        res.status(500).send('Error');
        console.log(error);
    }
});

app.get('/api/form', async (req, res) =>{
    try{
        const name = req.bpdy.name;
        const email = req.body.email;
        const age = req.body.age;
        const response = await client.query(`INSERT INTO user(name, email, age)VALUES('${name}','${email},'${age}')`);
        if (response){
            res.status(200).send(req.body);
        }
    }
    catch(errpr){
        res.status(500).send('Error');
        console.log(error);
    }
});

app.listen(3000, () => console.log('App is running on port 3000') );
