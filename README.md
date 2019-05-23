# web-monitoring

The repository of the application is : `https://github.com/maxgfr/web-monitoring.git`

## Description

This project is an implementation of a monitoring, alerting, and reporting infrastructure system based on Prometheus, Grafana, and Kafka. The infrastructure is based on docker, and the web application is a node.js application that has these main dependencies :
- [mongodb](https://github.com/mongodb/node-mongodb-native)
- [express](https://github.com/expressjs/express)
- [prom-client](https://github.com/siimon/prom-client)
- [kafka-node](https://github.com/SOHU-Co/kafka-node)

## Requirements


1. Install [git](https://git-scm.com/downloads)
2. Install [docker](https://docs.docker.com/v17.12/install/)
3. Install [docker-compose](https://docs.docker.com/compose/install/)
4. Clone this repository :
```bash
git clone --recursive https://github.com/maxgfr/web-monitoring.git
```

## Building & Running


### To start the infrastructure

```bash
docker-compose up --build
```

### To stop and remove the infrastructure

```bash
docker-compose down --rmi 'all'
```

## Usage

Now, we can run different request type `POST / GET / DELETE` (`http://localhost:1603`) :

<div align="center">
  <img src="https://github.com/maxgfr/web-monitoring/blob/master/screenshots/post.png" height="303,75" width="540"/>
  <img src="https://github.com/maxgfr/web-monitoring/blob/master/screenshots/get.png" height="303,75" width="540"/>
  <img src="https://github.com/maxgfr/web-monitoring/blob/master/screenshots/delete.png" height="303,75" width="540"/>
</div>
<br/>

We can also open `Prometheus` (`http://localhost:9090`) :

<div align="center">
  <img src="https://github.com/maxgfr/web-monitoring/blob/master/screenshots/prometheus.png" height="303,75" width="540"/>
</div>

Or see customized metrics in the application (`http://localhost:1603/metrics`) :

<div align="center">
  <img src="https://github.com/maxgfr/web-monitoring/blob/master/screenshots/metrics.png" height="303,75" width="540"/>
</div>
<br/>

Finally, we can use `Grafana` for the monitoring of the application (`http://localhost:3000`) :

<div align="center">
  <img src="https://github.com/maxgfr/web-monitoring/blob/master/screenshots/monitoring-node-1.png" height="303,75" width="540"/>
  <img src="https://github.com/maxgfr/web-monitoring/blob/master/screenshots/monitoring-node-2.png" height="303,75" width="540"/>
  <img src="https://github.com/maxgfr/web-monitoring/blob/master/screenshots/monitoring-mongo-1.png" height="303,75" width="540"/>
</div>
<br/>

*To connect to `Grafana`, by default, the username is `admin` and the password is `pass`*
