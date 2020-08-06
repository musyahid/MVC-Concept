const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3000

const rootIndex = require('./src/routes/index')
const routerAuthor = require('./src/routes/author')
const routerPost = require('./src/routes/post')
const routerComment = require('./src/routes/comment')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.use('/', rootIndex)
app.use('/author', routerAuthor)
app.use('/post', routerPost)
app.use('/comment', routerComment)


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
