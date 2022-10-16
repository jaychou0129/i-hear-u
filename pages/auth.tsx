import { doc, getDoc, setDoc } from "firebase/firestore";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { db } from "../firebase/clientApp";

const GamePage: NextPage = () => {
  const router = useRouter();
  const { user, data, redirect } = router.query;
  useEffect(() => {
    if (user && data) {
      const room_id = window.sessionStorage.getItem("redirect_id");
      const addToDatabase = async () => {
        const docRef = doc(db, "game_new", room_id!);
        const docSnap = await getDoc(docRef);
        var users = {};
        if (docSnap.exists()) {
          users = docSnap.data().users;
        }
        const userObj = JSON.parse(atob(String(data)));

        setDoc(
          docRef,
          { users: { ...users, [userObj.id]: userObj } },
          { merge: true }
        );

        router.push(`/room/${room_id}?user=${user}`);
      };

      addToDatabase();
    }
    if (redirect) {
      window.sessionStorage.setItem("redirect_id", String(redirect));
      router.push("/api/auth");
    }
  });

  return <></>;
};

export default GamePage;
