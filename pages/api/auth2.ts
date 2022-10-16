import type { NextApiRequest, NextApiResponse } from 'next'
import querystring from 'node:querystring'
// ?code=AQAFB9zasQ2KSM9A8DBu1MaMZ0fyxEXJqEInbPncC5clFThg-7E3Z4hdN1q6yWfPB8CWrQBsjAWTkLq6FpAq5IMdE6mirFIKgMkq29HSIEvZm-Zhr3JvGYYpeDZD_fZXqKMR6-EpyddyRqrmD09b1Qer8Vbs9BAZbmqXOXq5cL0FwpoGBDMCMN5mHXjaIiDeN7sTC5m5RXBMF1J5vIM-gEwTpUW21SI6NzKjB45vUzKg7HNvIxQf
const client_id = "caffbc46958b404b8dc0ea51e70c2206";
const client_secret = "e11f93c3b0fe4439beaf2a6bdc4b45ce";

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
  return await getData(accessToken, 'https://api.spotify.com/v1/me/top/tracks')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  if (state === null || code === null) {
    console.log("state is null");
    res.redirect(
      "https://localhost:3000/" +
      querystring.stringify({
        error: "state_mismatch",
      })
    );
  }

  const accessToken = await getAccessToken(<string>code);
  const profile = await getProfile(accessToken)
  const topTracks = await getTopTracks(accessToken)

  res.status(200).json(profile);
}
