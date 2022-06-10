# Build

```
docker build \
   -t nexus.bitq.dev/repository/bitquery/graphql-ide:`git rev-parse --short HEAD` .
```

# Make an alias latest
```
docker image tag \
   nexus.bitq.dev/repository/bitquery/graphql-ide:`git rev-parse --short HEAD` \
   nexus.bitq.dev/repository/bitquery/graphql-ide:latest
```

# Login to registry

```
apt install gnupg2 pass
docker login -u <login> https://nexus.bitq.dev
```

# Push image tags

```
docker image push nexus.bitq.dev/repository/bitquery/graphql-ide:`git rev-parse --short HEAD`
docker image push nexus.bitq.dev/repository/bitquery/graphql-ide:latest
```

# Run container

```
docker run -d \
   --name graphql-ide \
   --dns 10.0.0.254 \
   --dns-search etl-cluster.local \
   -v "$(pwd)/.env:/app/.env" \
   -p 127.0.0.1:5000:5000 \
   nexus.bitq.dev/repository/bitquery/graphql-ide:`git rev-parse --short HEAD`
```

