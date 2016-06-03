## Setup db

```
r.dbCreate("meted");
r.db("meted").tableCreate("photo");
r.db("meted").table("photo").indexCreate("flickrId");
```
