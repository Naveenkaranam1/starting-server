const express = require("express");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
//const { error } = require("console");
const app = express();
app.use(express.json());


const DBPath = path.join(__dirname, "demo.db");
let DB = null;

const inializeDBandServer = async ()=>{
    try{
        DB = await open({
            filename: DBPath,
            driver: sqlite3.Database,
        });
        app.listen(4000, ()=>{
            console.log("server was running on http://localhost:4000/");
        })
    }catch(e){
        console.log(`Error was ${e.message}`);
        process.exit(1); 
    }
}

inializeDBandServer();

//sending all student details
app.get("/students/", async(request, response) =>{
    const query = `SELECT * FROM student;`;
    const result = await DB.all(query);
    response.send(result);
})
//sending specific student details 
app.get("/students/:studentAge/", async(request, response) =>{
    const {studentAge} = request.params;
    const query = `SELECT * FROM student WHERE age = ${studentAge};`;
    const result = await DB.get(query);
    response.send(result);
})
//adding new student details
app.post("/student/", async(request, response) =>{
    const {name, age, score} = request.body;
    const query = `INSERT INTO student(name, age, score)values('${name}', ${age}, ${score});`;
    const result = await DB.run(query);
    const studentId = result.lastID;
    response.send({studentId:studentId});
})
