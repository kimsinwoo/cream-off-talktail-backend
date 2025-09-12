// swagger.config.js
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0', // OpenAPI 3.0 명세
    info: {
      title: 'Pet Skin Disease Detection API',
      version: '1.0.0',
      description: '반려동물 피부 질환 진단을 위한 API 문서'
    },
    servers: [{ url: 'http://localhost:4000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controller/*.ts'] // 라우트와 컨트롤러 파일 경로 지정
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;