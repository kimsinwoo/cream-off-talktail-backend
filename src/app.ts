import express from 'express'
import cors from 'cors'
import oauth from './routes/oauthRoutes'

let corsOptions = {
    origin: 'https://localhost:3000',
    credentials: true
}

const app = express()
require("dotenv").config();

const port = process.env.PORT;

app.use(cors(corsOptions));

app.use(express.json());

app.use('/auth', oauth)

app.listen(port, () => {
    console.log('서버가 주소는 ' + `http:localhost:${port}` + ' 입니다.')
})