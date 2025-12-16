const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.use(express.static(path.resolve(__dirname, 'dist')));
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`App is listening on port http://localhost:${port}`);
})