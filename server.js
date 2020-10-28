const express = require('express')
const path = require('path')

const expressApp = express()
const PORT = process.env.PORT || 8080

expressApp.use(express.static(__dirname));
expressApp.use(express.static(path.join(__dirname, 'build')));

expressApp.use('/ping', (_, res) => res.send('pong'))
expressApp.get('/*', function (_, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const startApp = () => {
    expressApp.listen(PORT, console.log(`Client static server up and running at port ${PORT}`))
}

startApp()
