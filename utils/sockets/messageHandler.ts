import { db } from "../../firebase/clientApp";
import { doc, DocumentData, getDoc, onSnapshot, setDoc } from "firebase/firestore";

const checkAllReady = (users) => {
  return Object.values(users).every((user) => user.ready)
}

const messageHandler = (io, socket) => {
  socket.on("toggle-ready", async ({ id, user }) => {
    console.log('got toggle ready: ', id, user)
    const docRef = doc(db, "game_new", id);
    const docSnap = await getDoc(docRef);
    let originalUser = {}
    let data: Record<string, string> = {}
    if (docSnap.exists()) {
      data = docSnap.data();
      originalUser = data.users[user] ?? {};
    }

    const updatedUser = { ...originalUser, ready: !originalUser.ready };
    const updatedUsers = { ...data.users, [user]: updatedUser };
    setDoc(
      doc(db, "game_new", String(id)),
      { ...data, users: updatedUsers },
      { merge: true }
    );
    if (checkAllReady(updatedUsers)) {
      console.log('all are ready')
      io.emit("update-game-state", 1);
    }
  })

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
}
export default messageHandler;