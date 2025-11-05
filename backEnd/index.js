let app = require("./src/app.js");

const port = process.env.PORT || 3000;  // Railway provides PORT automatically
app.listen(port, () => {
  console.log(`✅ Server started on port ${port}`);
});
