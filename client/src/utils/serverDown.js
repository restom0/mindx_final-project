export const SERVER_DOWN_EVENT = "mindx:server-down";
export const SERVER_DOWN_PATH = "/server-down";

export const notifyServerDown = (details = {}) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(SERVER_DOWN_EVENT, {
      detail: details
    })
  );
};
