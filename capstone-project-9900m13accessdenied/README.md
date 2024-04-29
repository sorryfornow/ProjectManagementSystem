# comp9990_p23
# Structure
```
|--- capstone-project-9900M13accessdenied
|
|------9900fronted
|      |---my-react-app
|           |---src
|           |---package.json
|
|------app.py
|------requirements.txt
|------README.md
```
# Installation
## Clone the project and switch to the correct branch
```
git clone git@github.com:unsw-cse-comp3900-9900-23T3/capstone-project-9900m13accessdenied.git
cd capstone-project-9900m13accessdenied
git checkout demoB
```

## Database
### Method 1: docker-compose
To make life easier, please use the following steps to have the database run on your machine
1. Start docker
2. In directory `capstone-project-9900m13accessdenied`, run `docker compose up`
3. Open another terminal, run `python3 app.py`
4. Follow the steps to run the front-end

Alternatively, you can use this account and password, see Method 2.
### Method 2: MongoDB accounts
```
account: yuwei878
password: yuwei8788
connection_url: mongodb+srv://yuwei878:yuwei8788@ccessdenied.f8rpoto.mongodb.net/
```
1. Install `MongoDB for VS Code` on vscode 
2. Add `connection_url` (mongodb+srv://yuwei878:yuwei8788@ccessdenied.f8rpoto.mongodb.net/) on your vscode
3. Open the terminal, run python3 app.py mongodb+srv://yuwei878:yuwei8788@ccessdenied.f8rpoto.mongodb.net/

You may also need to add your current IP here [https://cloud.mongodb.com/v2/6507de3dc8a70722e7b5a5d5#/security/network/accessList] into the access list.
![](./img4md/access_ips.jpg)

## Backend
```
pip install -r requirements.txt
python3 app.py
```

## Frontend
```
cd 9900fronted/my-react-app
npm install
npm start
```
You might need `sudo` for frontend or backend.

# MongoDB atlas connection:
Create User:
In the database access page, click add new database user to create a new user while providing a pair of name and password.
![](./img4md/userCreate.jpg)

Connecting:
Firstly, find the database deployment page in MongoDB atlas, and click connect, as the picture shows:
![](./img4md/db_deploy.jpg)
Then choose connect your application, and copy the connection url string as the picture shows:
![](./img4md/connecting_url.jpg)
Finally, replace the `<username>` with your own username, and replace the `<password>` with your own password, 
then paste it into the .ini file.

Database management:
In the database cluster page, click collections to manage the database.
Note that once the last collection is deleted, the database will be deleted as well.
![](./img4md/db_manage.jpg)

