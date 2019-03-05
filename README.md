[![codebeat badge](https://codebeat.co/badges/bd4bb644-ec62-405c-bd78-e64c3cd8f3b6)](https://codebeat.co/projects/github-com-qase-loggingserver-master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Maintainer: Zdenál](https://img.shields.io/badge/Maintainer-luba-blue.svg)](mailto:zdenek.balak@quanti.cz)
[![Qase: KotlinLogger](https://img.shields.io/badge/Qase-LoggingServer-ff69b4.svg)](https://github.com/Qase/LoggingServer)

## Logging server

Easy to use server for collecting and presenting logs from connected devices.

## Features
* Written in javascript
* Supports REST api as well as WebSocket connections
* Filter logs by session name, log severity or message content
* Project is constantly developed

## How do I run it localy?

#### Install

* Option 1:
	* install `nvm` from: https://github.com/creationix/nvm (instructions are in readme)
    * install `nodejs v10.15.0 ` by: `nvm install v10.15.0`
* Option 2:
    * install latest `node` stable from here: https://nodejs.org/en/download/

#### Run

* `cd PROJECT_ROOT_FOLDER` 
* run `npm install`
* run `gulp libs`
* run `gulp`
* use port `46379` for WebSocket or `63131` for REST Api
* browse `localhost:63131` for web interface

#### Share it outside of localhost

* use utility called [ngrok](https://ngrok.com/) to tunnel your localhost
* `ngrok http 63131` for REST API
* `ngrok http 46379` for WebSocket

## Endpoints

#### Log entity definition
| Field name  | Field type | Can be empty | Description                                               |
|-------------|------------|--------------|-----------------------------------------------------------|
| id          | String     | YES          | server id of log entity                                   |
| messsage    | String     | NO           | content of log                                            |
| sessionName | String     | NO           | filtering name                                            |
| severity    | String     | NO           | one of type - verbose, debug, info, warning, error, fatal |
| timestamp   | Int        | NO           | unix time in milliseconds                                 |

| REST api      |                                                |
|---------------|------------------------------------------------|
| rest function | POST                                           |
| http address  | `http://webserver/api/v1/log/`                 |
| headers       | Content-Type - application/json; charset=UTF-8 |
| body          | json - array of log entities                   |
| other         | be careful of max payload size 100kB           |
| response      | the exact same text with log id set            |

| WebSocket     |                                                |
|---------------|------------------------------------------------|
| address       | `ws://webserver/ws/v1/`                        |
| body          | json - array of log entities                   |
| response      | no response                                    |

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
