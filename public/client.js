window.client = (function () {
  function getTimers() {
    return fetch("api/timers").then(checkStatus).then(parseJSON);
  }
  function createTimer(data) {
    return fetch("/api/timers", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(checkStatus)
      .then(parseJSON);
  }
  function updateTimer(data) {
    return fetch("/api/timers", {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(checkStatus)
      .then(parseJSON);
  }
  function deleteTimer(data) {
    return fetch("/api/timers", {
      method: "delete",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(checkStatus)
      .then(parseJSON);
  }
  function startTimer(data) {
    return fetch("/api/timers/start", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(checkStatus)
      .then(parseJSON);
  }
  function stopTimer(data) {
    return fetch("/api/timers/stop", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(checkStatus)
      .then(parseJSON);
  }
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(`HTTP Error ${response.statusText}`);
      error.status = response.statusText;
      error.response = response;
      console.log(error);
      throw error;
    }
  }
  function parseJSON(response) {
    return new Promise((resolve, reject) => {
      resolve(response.json());
    });
  }
  return {
    getTimers,
    createTimer,
    updateTimer,
    deleteTimer,
    startTimer,
    stopTimer,
  };
})();
