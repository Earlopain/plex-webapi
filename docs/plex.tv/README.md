# plex.tv api documentation

All parameters may either be provided as a header or be put as a url parameter.
Some of the endpoints are capable of returning json while all can return xml. Calling the endpoint as is will result in xml. If you wish to get json you will have to put .json at the end of the endpoint. Calling an endpoint without the proper support will result in `500 INTERNAL SERVER ERROR`. If not otherwise specified, all endpoints will result in `401 NOT AUTHERIZED` if no token is supplied, returning an json object with `error` as its only key and a value describing the error.

## Open Endpoints

Open endpoints require no Authentication.

* [Login](login.md) : `POST /api/v2/users/signin`

## Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the header of the
request. The parameter name is `X-Plex-Token`. A Token can be acquired from the Login view above.

### Current User related

Each endpoint manipulates or displays information related to the User whose
Token is provided with the request:

* [Show info](user/accountinfo.md) : `GET /users/account/`
* [Show available connections](user/getclients.md) : `GET /pms/resources/`
