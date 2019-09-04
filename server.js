const app = require('./app');
const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Express server running at port ${PORT}`);
})