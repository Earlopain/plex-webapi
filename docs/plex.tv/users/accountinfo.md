# Show current user details

Get the details of the currently Authenticated User along with basic subscription information.

**URL** : `/users/account`

**Method** : `GET`

**Response format** : `json` `xml`

**Auth required** : YES

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "user": {
        "id": 23050858,
        "uuid": "2173b4956d9863f5",
        "email": "email@provider.com",
        "joined_at": "2017-12-25T00:44:31.000Z",
        "username": "Earlopain",
        "title": "Earlopain",
        "thumb": "https://plex.tv/users/2173b4956d9863f5/avatar?c=1556560276",
        "hasPassword": true,
        "authToken": "FztFmPAifE8Cqq9375ZP",
        "authentication_token": "FztFmPAifE8Cqq9375ZP",
        "subscription": {
            "active": false,
            "status": "Inactive",
            "plan": null,
            "features": [
                "adaptive_bitrate",
                "collections",
                "photos-metadata-edition"
            ]
        },
        "roles": {
            "roles": []
        },
        "entitlements": [],
        "confirmedAt": null,
        "forumId": null
    }
}
```