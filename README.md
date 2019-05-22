# web-monitoring

## To test all the infrastructure

```bash
docker-compose up
docker-compose down --rmi 'all'
```

## To test the node application with docker
```bash
docker build -t web-monitoring .
```

## To test kafka locally
```bash
brew install kafka
brew install zookeeper
zookeeper-server-start /usr/local/etc/kafka/zookeeper.properties
kafka-server-start /usr/local/etc/kafka/server.properties
kafka-topics --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test
kafka-console-producer --broker-list localhost:9092 --topic test
kafka-console-consumer --bootstrap-server localhost:9092 --topic test --from-beginning
```

## To remove all docker container
```bash
docker-compose rm
docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q) && docker rmi $(docker images -q)
```
