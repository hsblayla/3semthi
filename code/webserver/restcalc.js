const express = require('express');

const app = express ();
app.use(express.json());

const cors = require('cors');
app.use(cors());

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.get("/status", (request, response) => {
    const status = {
        "Status": "Running"
    };
    response.send(status);
});

app.get("/add", (request, response) => {
    
    const { a, b } = request.query; // Zugriff auf die Query-Parameter
    if ((a===undefined) || (b===undefined)) {
        response.status(500).send({error: "Gib bitte 2 Parameter a und b an!"})
    }
    const c = Number(a) + Number(b);
    console.log(`Adding ${a} and ${b} ...`);
    const result = {
        "ADDITION": "---",
        "a ": Number(a),
        "b ": Number(b),
        "Ergebnis": Number(c)
    }
    response.send(result);
});

app.get("/sub", (request, response) => {
    const { a, b } = request.query; // Zugriff auf die Query-Parameter
    if ((a===undefined) || (b===undefined)) {
        response.status(500).send({error: "Gib bitte 2 Parameter a und b an!"})
    }
    const c = Number(a) - Number(b);
    console.log("Substacting a and b ...", a, b);
    const result = {
        "SUBSTRAKTION": "---",
        "a ": Number(a),
        "b ": Number(b),
        "Ergebnis": Number(c)
    }
    response.send(result);
});

app.get("/times", (request, response) => {
    const { a, b } = request.query; // Zugriff auf die Query-Parameter
    if ((a===undefined) || (b===undefined)) {
        response.status(500).send({error: "Gib bitte 2 Parameter a und b an!"})
    }
    const c = Number(a) * Number(b);
    console.log(`Multiplying ${a} and ${b} ...`);
    const result = {
        "MULTIPLIKATION": "---",
        "a ": Number(a),
        "b ": Number(b),
        "Ergebnis": Number(c)
    }
    response.send(result);
});

app.get("/div", (request, response) => {
    const { a, b } = request.query; // Zugriff auf die Query-Parameter
    if ((a===undefined) || (b===undefined)) {
        response.status(500).send({error: "Gib bitte 2 Parameter a und b an!"})
    }
    if (parseFloat(b)==0) {
        response.status(500).send({error: "Lern Mathe du Wicht! Das darf man nicht"})
    } else {
        const c = parseFloat(a) / parseFloat(b);
        console.log(`Dividing ${a} by ${b} ...`);
        const result = {
            "DIVISION": "---",
            "a ": parseFloat(a),
            "b ": parseFloat(b),
            "Ergebnis": parseFloat(c)
        }
        response.send(result);
    }
});