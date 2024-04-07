let express = require('express');
let app = express();
let path = require('path');
const port = 8080;
var sql = require('mysql');
let bodyParser = require('body-parser');
const db = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "lootleague"
})
app.use('/static', express.static('static'));
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ extended:true}))
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'static/index.html'));
})
app.post('/fpost',(req, res)=>{
    const { nome, custo, valor, id, str} = req.body;
    const { authorization } = req.headers;
        res.send(
            {
                nome,
                custo,
                valor,
                id,
                str,
                authorization
            });
        /*console.log(nome);
        console.log(custo);
        console.log(valor);
        console.log(id);
        console.log(str);
        */
       const blob = Buffer.from(str, 'base64');
       console.log(blob);
       //nome=nidalee, custo=640, valor=320, ?, id=5
       const sqls = "INSERT INTO champ SET ?",
    values = {
        nome: nome,
        custo: custo,
        valor: valor,
        splash: blob,
        id: id
    };
       db.query(sqls, values, function(err, result){
        if (err) throw err;
        console.log("SUCESSO");
       })
})
app.get('/query', (req,res)=>{
    const str = "SELECT * FROM champ";
    db.query(str, (err, data)=>{
        if(err) return res.json("Error");
        return res.json(data);
    })
})
app.get('/imag', (req, res)=>{
    //const dataImagePrefix = `data:image/png;base64,`
    const str = "SELECT splash FROM champ WHERE nome='Nidalee';";
    db.query(str, (err, result, fields)=>{
        console.log(result[0]);
        const valor = Buffer.from(result, 'utf-8');
        console.log(valor);
       // console.log(buffer);
        if(err) return res.json("Error");
        return res.json(result);
    })
})
app.listen(port, ()=>{
    console.log(`api listening on port ${port}`);
})