// import app file
const app = require('./backend/app');
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log("App listening on port 3002");
});
