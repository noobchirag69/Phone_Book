// Imports
const express = require('express');
const mongoose = require('mongoose');
const Contact = require('./models/contact');

// Initiating Express
const app = express();

// Database Link
const dbURI = "mongodb+srv://chiragiemlabs007:0mMVVV9oHUfMsIDo@notepadcluster.tnx3oxu.mongodb.net/?retryWrites=true&w=majority";

// Setting the strictQuery True
mongoose.set('strictQuery', true);

// Connecting to Database and starting the server
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => app.listen(3000, console.log("Server running on port 3000!")))
    .catch(err => console.log(err));

// Setting View Engine
app.set('view engine', 'ejs');

// Middlewares
app.use('/views', express.static('views'));
app.use(express.urlencoded({ extended: true }));

// Getting all contacts from database and rendering them on home page
app.get('/', (req, res) => {
    Contact.find()
        .then(result => res.render('home', { title: "Home", contacts: result }))
        .catch(err => console.log(err));
});

// Add Page Route
app.get('/add', (req, res) => {
    res.render('add', { title: "Add" });
});

// Saving the Contact
app.post('/', (req, res) => {
    const contact = new Contact(req.body);
    contact.save()
        .then(result => res.redirect('/'))
        .catch(err => console.log(err));
});

// Edit Page Route
app.get('/edit/:id', (req, res) => {
    Contact.findById(req.params.id)
        .then(result => res.render('edit', { title: "Edit", contact: result }))
        .catch(err => console.log(err));
});

// Updating the Contact
app.post('/edit/:id', (req, res) => {
    Contact.findByIdAndUpdate(req.params.id, req.body)
        .then(result => res.redirect('/'))
        .catch(err => console.log(err));
});

// Deleting the Contact
app.get('/:id', (req, res) => {
    Contact.findByIdAndDelete(req.params.id)
        .then(result => res.redirect('/'))
        .catch(err => console.log(err));
});

// Error Page
app.use((req, res) => {
    res.status(404).send("Sorry, page not found :/");
});
