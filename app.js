const express = require('express');
const app = express();

app.get('/api', function (req, res) {
    res.send('Registration API')
})

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
