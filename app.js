const express = require('express')
const config = require('config')
// const path = require('path')
const PORT = config.get('port') || 5000
const mongoose = require('mongoose')

const app = express()
app.use(express.json({extended: true}))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/task',require('./routes/task.routes'))
app.use('/api/team',require('./routes/team.routes'))
app.use('/api/feature',require('./routes/features.routes'))
//app.use('/t',require('./routes/redirect.routes'))

// if(process.env.NODE_ENV === 'production'){
//     app.use('/',express.static(path.join(__dirname,'client_old','build')))
//
//     app.get('*',(req,res) =>{
//         res.sendFile(path.resolve(__dirname,'client_old','build','index.html'))
//     })
// }

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
    } catch (e) {
        console.log("Server Error", e.message)
        process.exit(1)
    }
}

start()