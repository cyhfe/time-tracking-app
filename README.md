# 任务计时器

<img src="./assets/preview.png" width="600">

[在线演示（Live-Demo）](https://timer-tracking-app.herokuapp.com/): 使用heroku部署。

## 后端
使用express框架
- 提供静态文件
``` javascript
  app.use("/", express.static(path.join(__dirname, "public")));
```
- 使用fs模块保存数据
``` javascript
const DATA_FILE = path.join(__dirname, "data.json");

app.get("/api/timers", (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    res.json(JSON.parse(data));
  });
});
```

- 提供RESTFUL API
