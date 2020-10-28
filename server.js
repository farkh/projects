const express = require('express')
const path = require('path')

const expressApp = express()
const PORT = process.env.PORT || 8080

expressApp.use('/', express.static(path.join(__dirname, 'public')))

const startApp = () => {
    expressApp.listen(PORT, console.log(`Client static server up and running at port ${PORT}`))
}

startApp()
