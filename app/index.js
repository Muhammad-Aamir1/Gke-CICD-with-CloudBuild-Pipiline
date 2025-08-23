const express = require('express');
const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
    res.send('Hello, World! This is a new test deployment via Cloud Build to GKE Autopilot.');
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
