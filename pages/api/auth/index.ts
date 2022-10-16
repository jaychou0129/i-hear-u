import type { NextApiRequest, NextApiResponse } from 'next'
import querystring from 'node:querystring'
const client_id = process.env.SPOTIFY_CLIENT_ID;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const state = generateRandomString(16);
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: client_id,
      scope: "user-read-private user-read-email user-top-read",
      redirect_uri:
        "http://localhost:3000/api/auth/callback",
      state: state
    })
  );
}

const generateRandomString = (myLength: number) => {
  const chars =
    "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const randomArray = Array.from(
    { length: myLength },
    (v, k) => chars[Math.floor(Math.random() * chars.length)]
  );

  const randomString = randomArray.join("");
  return randomString;
};