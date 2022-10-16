import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Router from "next/router";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/clientApp";
const createRoom = async () => {
  const docRef = await addDoc(collection(db, "game_new"), {
    users: {},
    questions: [],
    results: {},
    state: 0,
    currentQuestion: 0,
  });
  Router.push(`/room/${docRef.id}`);
};

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>I Hear U</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>I Hear U!</h1>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="15vh"
        >
          <Button size="large" variant="outlined" onClick={createRoom}>
            START
          </Button>
        </Box>
      </main>
    </div>
  );
};

export default Home;
