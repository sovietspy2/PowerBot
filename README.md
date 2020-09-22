# PowerBot
 This is a discord bot

required environment variables:
```
TOKEN=xxx
COMPLETE_TEMPLATE=something
DB=/data/power
```


###docker-compose.yml:
```
version: "3"

services:
    power-bot:
        image: sovietspy2/power-bot:latest
        ports:
            - 80:80
        volumes:
            - ./data:/data
        environment:
            - TOKEN=xxx
            - COMPLETE_TEMPLATE=zzz
            - DB=/data/power
        logging:
          driver: "json-file"
          options:
            max-size: "200k"
            max-file: "10"
```
