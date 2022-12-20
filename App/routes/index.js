/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');
var router = express.Router();
var msRestNodeAuth = require("@azure/ms-rest-nodeauth");

router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'MSAL Node & Express Web App',
        isAuthenticated: req.session.isAuthenticated,
        username: req.session.account?.username,
    });
});
router.post('/auth/redirect', (req,res) => {
    console.log(req);
    return res.end();
});

router.post("/logout",(req,res) => {
    return res.send(req)
});

//get accesstoken while authentication complition then getting refresh token
async function getToken(){
    const credentials = await msRestNodeAuth.loginWithUsernamePassword(
      USERNAME,
      PASSWORD, {
        domain: TENANT_ID,
      },
    );
    // Mimic Azure CLI`s 'az account get-access-token' to avoid spn: prefix
    const { refreshToken } = (await credentials.getToken());
    const resp = await axios.request<{ access_token: string }>({
      method: 'POST',
      url: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/token`,
      data: qs.stringify({
        grant_type: 'refresh_token',
        client_id: credentials.clientId,
        resource: APPLICATION_ID,
        refresh_token: refreshToken,
      }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return resp.data.access_token;
  }












module.exports = router;
