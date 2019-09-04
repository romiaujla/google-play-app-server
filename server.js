const app = require('./app');
const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Express Server is running at port ${PORT}`);
})