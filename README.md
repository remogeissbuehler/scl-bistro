```docker build . -t remo/bistro-app```
```docker run -p 443:4430 --env PORT=4430 docker.io/remo/bistro-app```


```shell
docker build . -f debug-server.Dockerfile -t remo/bistro-server
docker run -p 8080:8080 remo/bistro-server
```