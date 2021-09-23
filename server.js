const fs = require("fs");
const path = require("path");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { json, urlencoded } = require("body-parser");
const morgan = require("morgan");

const app = express();

//disable the X-Powered-By header. 默认启用,会返回有关服务器信息的header
app.disable("x-powered-by");

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/", express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

const DATA_FILE = path.join(__dirname, "data.json");

// read
app.get("/api/timers", (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    res.json(JSON.parse(data));
  });
});

// creat
app.post("/api/timers", (req, res) => {
  console.log(req.body);
  if (req.body.project && req.body.title) {
    fs.readFile(DATA_FILE, (err, data) => {
      const timers = JSON.parse(data);
      const newTimer = {
        id: uuidv4(),
        title: req.body.title,
        project: req.body.project,
        elapsed: 0,
        runningSince: null,
      };
      timers.push(newTimer);
      fs.writeFile(DATA_FILE, JSON.stringify(timers, null, 4), () => {
        res.json(timers);
      });
    });
  } else {
    res.status(400).send("缺少参数");
  }
});

// update
app.put("/api/timers", (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    const timers = JSON.parse(data);
    const newTimers = timers.map((timer) => {
      if (timer.id === req.body.id) {
        return {
          id: timer.id,
          project: req.body.project,
          title: req.body.title,
          elapsed: timer.elapsed,
          runningSince: null,
        };
      } else {
        return timer;
      }
    });
    fs.writeFile(DATA_FILE, JSON.stringify(newTimers, null, 2), () => {
      res.send(newTimers);
    });
  });
});

// delete
app.delete("/api/timers", (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    const timers = JSON.parse(data);
    const newTimers = timers.reduce((memo, timer) => {
      if (timer.id === req.body.id) {
        return memo;
      } else {
        return memo.concat(timer);
      }
    }, []);
    fs.writeFile(DATA_FILE, JSON.stringify(newTimers, null, 2), () => {
      res.send(newTimers);
    });
  });
});

// start
app.post("/api/timers/start", (req, res) => {
  console.log(req.body);
  fs.readFile(DATA_FILE, (err, data) => {
    const timers = JSON.parse(data);
    const newTimers = timers.map((timer) => {
      if (timer.id === req.body.id) {
        return {
          ...timer,
          runningSince: req.body.start,
        };
      } else {
        return timer;
      }
    });
    fs.writeFile(DATA_FILE, JSON.stringify(newTimers, null, 2), () => {
      res.send(newTimers);
    });
  });
});

// stop
app.post("/api/timers/stop", (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    const timers = JSON.parse(data);
    const newTimers = timers.map((timer) => {
      if (timer.id === req.body.id) {
        let elapsed = timer.elapsed;
        elapsed += req.body.stop - timer.runningSince;
        return {
          ...timer,
          elapsed,
          runningSince: null,
        };
      } else {
        return timer;
      }
    });
    fs.writeFile(DATA_FILE, JSON.stringify(newTimers, null, 2), () => {
      res.send(newTimers);
    });
  });
});

app.listen(3000, () => {
  console.log("server runing in port 3000");
});
