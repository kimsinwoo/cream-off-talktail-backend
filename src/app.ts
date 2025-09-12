import express from 'express'
import swaggerSpec from './swagger.config'; // 위에서 만든 설정 파일 불러오기
import swaggerUi from 'swagger-ui-express';
import cors from 'cors'
import oauth from './routes/oauthRoutes'
import upload from './routes/imageRoutes'

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Swagger UI 엔드포인트 설정
app.use(express.json());

app.use('/auth', oauth)
app.use('/upload', upload)

app.listen(port, () => {
    console.log('서버가 주소는 ' + `http:localhost:${port}` + ' 입니다.')
})