const express = require('express');
const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
    // Correct way: Combine the two messages into a single string.
    res.send('Hello, World! This is a new test deployment via Cloud Build to GKE Autopilot. Hello, Picture to saalo se baki h lekin show to ab suru hoga!.');
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});