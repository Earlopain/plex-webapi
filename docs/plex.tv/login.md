# Login

Used to collect a Token for a registered User.

**URL** : `/api/v2/users/signin`

**Method** : `POST`

**Response format** : `json` `xml`

**Auth required** : NO

**URL parameter constrains**

`login` : email of user
`password` : password of user

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "authToken": "D3ZAsfpznndwKp53jFjy",
    "certificateVersion": 2,
    "cloudSyncDevice": null,
    "email": "email@provider.com",
    "emailOnlyAuth": false,
    "entitlements": [],
    "guest": false,
    "hasPassword": true,
    "home": false,
    "homeSize": 1,
    "id": 23248710,
    "locale": null,
    "mailingListActive": true,
    "mailingListStatus": "active",
    "profile": {
        "autoSelectAudio": true,
        "autoSelectSubtitle": 1,
        "defaultAudioLanguage": null,
        "defaultSubtitleAccessibility": 0,
        "defaultSubtitleForced": 0,
        "defaultSubtitleLanguage": null

    },
    "queueEmail": "queue+3XH9Pi6E2cyawkRj6d2V@save.plex.tv",
    "queueUid": "92cce1364617c640",
    "rememberExpiresAt": 1558365800,
    "restriced": false,
    "scrobbleTypes": "",
    "services": [{
        "endpoint": "https://tmsapi.plex.tv/v1.1/",
        "identifier": "tmsapi",
        "status" : "online",
        "token": "aj37UJAfj284jfjIwjdRUjLCRoQkgY2jwJsLgi8+OQ="
    }]
}
```

## Error Response

**Condition** : If `login` and `password` combination is wrong.

**Code** : `401 NOT AUTHERIZED`

**Content** :

```json
{
    "errors": [{
        "code": 1001,
        "message": "User could not be authenticated"
    }]
}
```