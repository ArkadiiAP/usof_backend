require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const upload = require('./middleware/upload')
const multer = require('multer')

const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(express.static('avatars'))

// async function test(){
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }
//
// test();

app.use('/api/auth', require('./routers/authRouter'))
app.use('/api/users', require('./routers/userRouter'))
app.use('/api/posts', require('./routers/postRouter'))
app.use('/api/categories', require('./routers/categoryRouter'))
app.use('/api/comments', require('./routers/commentRouter'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log('Server is running on port ', PORT)
})
