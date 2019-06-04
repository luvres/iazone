## Node and Firebase
-----


### install Docker
```
curl -sSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### Run
```
git clone https://github.com/luvres/aizone.git

cd aizone
```
```
docker run --rm --name Node \
-v $PWD:/root \
-w /root \
-p 9005:9005 \
-p 5001:5001 \
-ti node:10.16.0-alpine \
ash -c "apk --no-cache add bash nano \
        && npm install -g firebase-tools \
        && bash"
```

### Config
```
firebase login

firebase init

firebase deploy --only hosting

firebase deploy --only functions
```
