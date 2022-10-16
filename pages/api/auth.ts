import type { NextApiRequest, NextApiResponse } from 'next'
import querystring from 'node:querystring'
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const client_id = "caffbc46958b404b8dc0ea51e70c2206";
  const client_secret = "e11f93c3b0fe4439beaf2a6bdc4b45ce";

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

  const state = generateRandomString(16);
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: client_id,
      scope: "user-read-private user-read-email user-top-read",
      redirect_uri:
        "http://localhost:3000/api/auth2",
      state: state
    })
  );
}