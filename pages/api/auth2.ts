import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from "../../firebase/clientApp";
import { doc, DocumentData, getDoc, onSnapshot, setDoc } from "firebase/firestore";
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const getAccessToken = async (code: string) => {
  const authOptions = {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: encodeURI("http://localhost:3000/api/auth2"),
    }),
  };

  const response = await fetch(
    "https://accounts.spotify.com/api/token",
    authOptions
  );
  const data = await response.json()
  return data.access_token;
}

const getData = async (accessToken: string, apiUrl: string) => {
  const authOptions = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const response = await fetch(apiUrl,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    }
  );
  const data = await response.json();
  return data
}

const getProfile = async (accessToken: string) => {
  return await getData(accessToken, 'https://api.spotify.com/v1/me')
}

const getTopTracks = async (accessToken: string) => {
  const limit = 10
  const time_range = "medium_term"
  return await getData(accessToken, `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${time_range}`)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  if (state === null || code === null) {
    console.log("state is null");
    res.redirect("https://localhost:3000/");
  }

  const accessToken = await getAccessToken(<string>code);
  const profile = await getProfile(accessToken)
  const topTracks = await getTopTracks(accessToken)

  const cleanedTopTracks = topTracks.items.map((entry: any) => {
    return {
      name: entry.name,
      artists: entry.artists.map((artist: any) => artist.name),
      preview: entry.preview_url,
      img: entry.album.images.length ? entry.album.images[0].url : ''
    }
  })

  // add user to database
  // const docRef = doc(db, "game_new", "1HbU4IIs1DTueuxrHcm4");
  // const docSnap = await getDoc(docRef);
  // var users = {}
  // if (docSnap.exists()) {
  //   users = docSnap.data().users;
  // }
  const userId = profile.id
  const userImg = profile.images.length ? profile.images[0].url : ''
  const userObj = {
    id: userId,
    name: profile.display_name,
    email: profile.email,
    image: userImg,
    top: cleanedTopTracks,
  }

  // setDoc(
  //   docRef,
  //   { users: { ...users, [userId]: userObj } },
  //   { merge: true }
  // );

  res.redirect(`/auth?user=${userId}&data=${Buffer.from(JSON.stringify(userObj)).toString("base64")}`)
}
