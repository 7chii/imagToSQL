let express = require('express');
let app = express();
let path = require('path');
const port = 8080;
var sql = require('mysql');
//const { promise } = require('bcrypt/promises');

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
            console.log(nome);
            console.log(custo);
            console.log(valor);
            console.log(id);
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
app.post('/img', (req, res)=>{
    const { nome, custo, valor, id, str} = req.body;
    const { authorization } = req.headers;
        /*res.setHeader(

            {
                nome,
                custo,
                valor,
                id,
                str,
                authorization
            });*/
            console.log(nome);
            console.log(custo);
            console.log(valor);
            console.log(id);
       const blob = Buffer.from(str, 'base64');
       console.log(blob);
       const sqls = `SELECT splash FROM champ WHERE nome='${nome}';`;
       
    db.query(sqls, (err, result)=>{
        if (err) throw err;
        const dat = Buffer.from(result[0].splash);
        var string = dat.toString('base64');
        var partS = string.split('jpegbase64');
        //console.log(partS[1]);
        res.send(`"${partS[1]}"`);
        //<img src="data:image/jpg;base64, " alt="" height="900">
});
});
app.get('/imag', async(req, res)=>{
    //const dataImagePrefix = `data:image/png;base64,`
    const str = `SELECT splash FROM champ WHERE nome='${nomer}';`;
    db.query(str, (err, result)=>{
        if (err) throw err;
        const dat = Buffer.from(result[0].splash);
        var string = dat.toString('base64');
        var partS = string.split('jpegbase64');
        res.send(`<img src="data:image/jpg;base64, ${partS[1]}" alt="" height="900">`);
        //console.log(partS[1]);
    })
})
app.listen(port, ()=>{
    console.log(`api listening on port ${port}`);
});