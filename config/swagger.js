import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

export const setupSwagger = (app, __dirname) => {
  const swaggerDocument = YAML.load(
    path.join(__dirname, 'api-docs', 'openapi-spec.yaml')
  );

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customCss: `
        .opblock-get .opblock-summary-method    { background: #4caf50 !important; }
        .opblock-post .opblock-summary-method   { background: #ffb300 !important; }
        .opblock-put .opblock-summary-method    { background: #2196f3 !important; }
        .opblock-delete .opblock-summary-method { background: #f44336 !important; }
      `,
    })
  );
};
