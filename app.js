const express = require('express');
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo_db:27017/hsedb';
const mongoose = require('mongoose');

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(express.json({limit: '50mb'}));
app.use(express.static('uploads'));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/project',require('./routes/project.routes'));
app.use('/api/epic',require('./routes/epic.routes'));
app.use('/api/feature',require('./routes/features.routes'));
app.use('/api/task',require('./routes/task.routes'));
app.use('/api/upload',require('./routes/upload.routes'));

async function start() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
    } catch (e) {
        console.log("Server Error!", e.message);
        process.exit(1);
    }
}

start();