const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

let users = require("./MOCK_DATA.json");

app.use(express.json());





//REST API

//GET
app.get('/api/users', (req, res) => { 
    return res.json(users)
})

app.get('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
})


//POST
app.post('/api/users', (req, res) => {
    const body = req.body;
    const newUser = { ...body, id: users.length + 1 };

    users.push(newUser);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to save user" });
        }

        return res.json({
            status: "success",
            user: newUser
        });
    });
});


//PUT
app.put('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "User not found" });
    }


    users[index] = { ...req.body, id };

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), err => {
        if (err) {
            return res.status(500).json({ error: "Failed to update user" });
        }


        return res.json({
            status: "success",
            user: users[index]
        });
    });
});



//PATCH
app.patch('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }


    Object.assign(user, req.body);

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), err => {
        if (err) return res.status(500).json({ error: "Failed to update user" });
        return res.json({ status: "success", user });
    });
});


//DELETE
app.delete('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const originalLength = users.length;

    users = users.filter(user => user.id !== id);

    if (users.length === originalLength) {
        return res.status(404).json({ error: "User not found" });
    }

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), err => {
        if (err) return res.status(500).json({ error: "Failed to delete user" });
        return res.json({ status: "deleted", id });
    });
});




app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})