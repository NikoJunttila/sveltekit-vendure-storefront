import { handler } from './build/handler.js';
import express from 'express';

const app = express();
const port = process.env.PORT || 4000; // Default to 4000 if no ENV var

app.use(handler);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});