# mock-micro-graphql-auth
mock api server with micro-dev, graphql, authorization.

## Install

```
yarn install
```

## Start

```
yarn micro-dev
```

Go to http://localhost:3000/graphql from Google Chrome.
You can see GraphQL playground!

## Access with cURL

0. Install jq

```
# Debian or Ubuntu
sudo apt-get install jq

# Mac OS
brew install jq
```

1. Get Access Token

```
content=$(curl --silent --request POST http://localhost:3000/auth/login \
--header 'content-type: application/json' \
--data '{
  "email": "hoge@email.com",
  "password":"hoge"
}')
access_token=$(jq -r  '.access_token' <<< "${content}" )
```

2. Post GraphQL query with your access token

```
curl --silent --request POST \
  --url http://localhost:3000/graphql \
  --header "authorization: Bearer $access_token" \
  --header 'content-type: application/json' \
  --data '{"query":"{\n  users{\n    id\n    name\n  }\n}"}'
```

## License

MIT
