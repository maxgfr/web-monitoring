# web-monitoring

### Usage

```bash
cd nodock && docker-compose up -d mongo node nginx
```

By going to `127.0.0.1` in your browser you should be seeing a message indicating that `node` has successfully connected to `mongo`.

### To stop it

```bash
cd nodock && docker-compose down
```
