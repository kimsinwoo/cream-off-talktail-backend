import express from 'express'
import cors from 'cors'
import oauth from './routes/oauthRoutes'

const app = express()
require("dotenv").config();

const port = process.env.PORT;

const allowedOrigins = ["http://localhost:3000", "https://localhost:3000"];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use('/auth', oauth)

app.listen(port, () => {
    console.log('서버가 주소는 ' + `http:localhost:${port}` + ' 입니다.')
})