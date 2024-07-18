const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/drawingApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// .then(() => {
//     console.log('Connected to MongoDB');
// })
// .catch(err => {
//     console.error('Error connecting to MongoDB:', err);
// });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a schema for drawings
const drawingSchema = new mongoose.Schema({
    image: String,
    created_at: { type: Date, default: Date.now }
});
const Drawing = mongoose.model('Drawing', drawingSchema);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.set("view engine","ejs");
app.use(express.json()); 

// Route to save a drawing
app.post('/save-drawing', async (req, res) => {
    const { image } = req.body;
    try {
        if (!image) {
            return res.status(400).send('No image data provided');
        }
        const newDrawing = new Drawing({ image });
        await newDrawing.save();
        res.status(201).send('Drawing saved successfully');
    } catch (err) {
        console.error('Error saving drawing:', err);
        res.status(500).send('Error saving drawing');
    }
});


// // Route to get the last drawing
app.get('/last-drawing', async (req, res) => {
    try {
        // console.log('chala ');
        const lastDrawing = await Drawing.findOne().sort({ created_at: -1 });
        if (lastDrawing) {
            res.status(200).json({ image: lastDrawing.image });
        } else {
            res.status(404).send('No drawings found');
        }
    } catch (err) {
        console.error('Error fetching last drawing:', err);
        res.status(500).send('Error fetching last drawing');
    }
});

app.get("/",(req,res)=>{
    return res.render("index")
})
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
