const buttons = document.getElementsByTagName("button");
const { ipcRenderer } = require("electron");

const mainReturn = () => {
  ipcRenderer.once("action", (e, arg) => {
    console.log(arg);
  });
};

const windowEvent = (event) => {
  switch (event) {
    case "close":
      ipcRenderer.send("action", "close");
      return;
    case "maximize":
      ipcRenderer.send("action", "maximize");
      return;
    case "minimize":
      ipcRenderer.send("action", "minimize");
      break;
  }
};

const actionButtons = Array.from(buttons);

actionButtons.map((button) => {
  button.addEventListener("click", (event) => {
    windowEvent(event.target.value);
  });
});

mainReturn();
