# Show available connections

Get all authorized servers and clients

**URL** : `/users/account`

**Method** : `GET`

**Response format** : `xml`

**Auth required** : YES

**URL parameter** : 

`includeHttps` : 0 | 1

Default 0. If set to 1, all connection protocols will be set to https and the uris will be routed through https://[ip].[hash].plex.direct:[port].
See https://blog.filippo.io/how-plex-is-doing-https-for-all-its-users/

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "MediaContainer": {
        "size": "2",
        "Device": [
            {
                "name": "plex-server",
                "product": "Plex Media Server",
                "productVersion": "1.15.3.876-ad6e39743",
                "platform": "Linux",
                "platformVersion": "18.04.2 LTS (Bionic Beaver)",
                "device": "PC",
                "clientIdentifier": "e2cbe96aab2199fa55d756bce2a3bd8a673f99fb",
                "createdAt": "1555199180",
                "lastSeenAt": "1557315999",
                "provides": "server",
                "owned": "1",
                "accessToken": "GVCpfgFLnBE8P22BfaQZP",
                "publicAddress": "123.456.789.10",
                "httpsRequired": "0",
                "synced": "0",
                "relay": "1",
                "dnsRebindingProtection": "0",
                "publicAddressMatches": "1",
                "presence": "1",
                "Connection": [
                    {
                        "protocol": "http",
                        "address": "192.168.178.97",
                        "port": "32400",
                        "uri": "http://192.168.178.97:32400",
                        "local": "1"
                    },
                    {
                        "protocol": "http",
                        "address": "123.456.789.10",
                        "port": "32400",
                        "uri": "http://123.456.789.10:32400",
                        "local": "0"
                    }
                ]
            },
            {
                "name": "P20 lite",
                "product": "Plex for Android",
                "productVersion": "7.14.1.9954",
                "platform": "Android",
                "platformVersion": "8.0.0",
                "device": "ANE-LX1",
                "clientIdentifier": "273efb638a82a1cf-com-plexapp-android",
                "createdAt": "1556801510",
                "lastSeenAt": "1557278548",
                "provides": "player,pubsub-player,controller,sync-target",
                "owned": "1",
                "publicAddress": "123.456.789.10",
                "publicAddressMatches": "0",
                "presence": "0",
                "Connection": [
                    {
                        "protocol": "http",
                        "address": "192.168.178.70",
                        "port": "32500",
                        "uri": "http://192.168.178.70:32500",
                        "local": "1"
                    }
                ]
            }
        ]
    }
}
```