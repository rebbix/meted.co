## Setup db

```
r.dbCreate("meted");
r.db("meted").tableCreate("photo");
r.db("meted").table("photo").indexCreate("flickrId");
r.db("meted").table("photo").indexCreate("viewCount");
```

*Production only*
Change API keys for TinyEye from sandbox to production:
```
TINYEYE_PUBLIC_KEY=jAYP,_sYFZQCz1QYz3Qg
TINYEYE_PRIVATE_KEY=8H+4guad^8vCgg7KIBQ,,gE_94D1BDtvwE3U9Jii
```

### Production run
env HOST=localhost PORT=5000 NODE_ENV=production TINYEYE_PUBLIC_KEY='jAYP,_sYFZQCz1QYz3Qg' TINYEYE_PRIVATE_KEY='8H+4guad^8vCgg7KIBQ,,gE_94D1BDtvwE3U9Jii' node ./index.js


## Release procedure

```
git pull
npm install
sudo restart meted-app
```
