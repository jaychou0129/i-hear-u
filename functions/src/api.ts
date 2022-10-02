const router = require("express").Router();
var querystring = require("querystring");

const client_id = "b40371e064584491b035f2a03113cc70";
const client_secret = "f4443f764b544c83b469a9b5b1f76cb8";

var request = require("request");
const axios = require("axios");

router.get("/", (req: any, res: any) => {
  var scope = "user-read-private user-read-email user-top-read";

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: "b40371e064584491b035f2a03113cc70",
        scope: scope,
        redirect_uri:
          "https://us-central1-i-hear-u.cloudfunctions.net/auth/callback",
      })
  );
});

router.get("/callback", async (req: any, res: any) => {
  console.log(req.query.code);
  var code = req.query.code;

  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri:
        "https://us-central1-i-hear-u.cloudfunctions.net/auth/callback",
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    json: true,
  };

  request.post(authOptions, function (error: any, response: any, body: any) {
    console.log(response.statusCode);
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token,
        refresh_token = body.refresh_token;

      function getProfile() {
        return new Promise(function (resolve, reject) {
          var options = {
            url: "https://api.spotify.com/v1/me",
            headers: { Authorization: "Bearer " + access_token },
            json: true,
          };

          request.get(options, function (error: any, response: any, body: any) {
            console.log(body);
            resolve(response);
          });
        });
      }

      var options = {
        url: "https://api.spotify.com/v1/me/top/tracks",
        headers: { Authorization: "Bearer " + access_token },
        json: true,
      };

      getProfile().then(() => {
        request.get(options, function (error: any, response: any, body: any) {
          console.log(body);
        });
      });

      // use the access token to access the Spotify Web API
      request.get(options, function (error: any, response: any, body: any) {
        console.log(body);
      });

      // redirect up to auth
      res.redirect(
        "/#" +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token,
          })
      );
    } else {
      res.redirect(
        "/#" +
          querystring.stringify({
            error: "invalid_token",
          })
      );
    }
  });
});

module.exports = router;
