[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Maintainer: luba](https://img.shields.io/badge/Maintainer-luba-blue.svg)](mailto:lubos.helcl@quanti.cz)
[![Qase: KotlinLogger](https://img.shields.io/badge/Qase-LoggingServer-ff69b4.svg)](https://github.com/Qase/LoggingServer)

## Logging server

Easy to use server for collecting and presenting logs from connected devices.

## Features
* Written in javascript
* Supports REST api as well as WebSocket connections
* Filter logs by session name, log severity or message content
* ---------- nejaky paramtery pri spousteni??

## How do I run it localy?

#### Install

* Option 1:
	* install `nvm` from: https://github.com/creationix/nvm (instructions are in readme)
    * install `nodejs v10.15.0 ` by: `nvm install v10.15.0`
* Option 2:
    * install latest `node` stable from here: https://nodejs.org/en/download/

#### Run

* run `npm install`
* `cd PROJECT_ROOT_FOLDER`
* run `nodejs bin/www`

#### Share it outside of localhost

* use utility called [ngrok](https://ngrok.com/) to tunnel your localhost
* `ngrok http 3000` for REST API
* `ngrok http 12345` for WebSocket

## Endpoints

#### Log entity definition
| Field name  | Field type | Can be empty | Description                                               |
|-------------|------------|--------------|-----------------------------------------------------------|
| id          | String     | YES          | ?????????????message,                                     |
| messsage    | String     | NO:::        | content                                                   |
| sessionName | String     | xd           | filtering name                                            |
| severity    | String     | d            | one of type - verbose, debug, info, warning, error, fatal |
| timestamp   | Int        | no           | unix time in milliseconds                                 |

| REST api      |                                                |
|---------------|------------------------------------------------|
| rest function | POST                                           |
| http address  | `http://webserver/api/v1/log/`                 |
| headers       | Content-Type - application/json; charset=UTF-8 |
| body          | json                                           |
| other         | max payload size                               |
| response      | the exact same text                            |

| WebSocket     |                                                |
|---------------|------------------------------------------------|
| address       | `ws://webserver/ws/v1/`                        |
| body          | json                                           |
| other         | max payload size                               |
| response      | exact      is tehre any???                     |

###### Example
```
POST /api/v1/log/ HTTP/1.1
Host: webserver
Content-Type: application/json; charset=UTF-8

[
    {
        "id": "",
        "message": "Test log message",
        "sessionName": "MyAndroidSession",
        "severity": "ERROR",
        "timestamp": 1547927957870
    }
]
```

## License
[MIT](https://github.com/nishanths/license/blob/master/LICENSE)
