import {
  createSession,
  readSessionById,
  readSessions,
  deleteSession,
  updateSession,
} from "../classes/Session.js";

function getSessionToken() {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "sessionToken") {
      return value;
    }
  }
  return null;
}

function deleteSessionAndCookie(sessionId) {
  deleteSession(sessionId).then(() => {
    document.cookie =
      "sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  });
}

readSessions().then((sessions) => {
  const sessionToken = getSessionToken();
  console.log(sessionToken);
  for (let session of sessions) {
    if (session.se_token === sessionToken) {
      deleteSessionAndCookie(session.se_id);
    }
  }
  setTimeout(() => {
    window.location.href = "./index.php";
  }, 100);
});
