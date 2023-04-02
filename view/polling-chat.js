const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");

const BACK_OFF = 5000;
const INTERVAL = 3000;

let allChat = [];
let failedTries = 0;
let timeToMakeNextRequest = 0;

// given a user and a msg, it returns an HTML string to render to the UI
const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

function render() {
  const html = allChat.map(({ user, text, time, id }) =>
    template(user, text, time, id)
  );
  msgs.innerHTML = html.join("\n");
}

// a submit listener on the form in the HTML
chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  const data = { user, text };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  return fetch("/poll", options);
}

async function getNewMsgs() {
  try {
    const res = await fetch("/poll");
    let json = await res.json();

    if (res.status >= 400) {
      throw new Error("request did not succeed: " + res.status);
    } else {
      failedTries = 0;
      allChat = json.msg;
      render();
    }
  } catch (error) {
    console.error("Polling Error, ", error);
    failedTries++;
  }
}

function checkForNewMessage() {
  requestAnimationFrame(async (time) => {
    if (timeToMakeNextRequest <= time) {
      await getNewMsgs();
      timeToMakeNextRequest = time + INTERVAL + failedTries * BACK_OFF;
    }
    checkForNewMessage();
  });
}

checkForNewMessage();
