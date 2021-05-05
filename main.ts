import { app, BrowserWindow } from "electron";
import dotenv from "dotenv";
dotenv.config();
import expressApp from "./app";

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
    },
  });
  if (process.env.NODE_ENV !== "development") win.removeMenu();
  expressApp(win);
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
