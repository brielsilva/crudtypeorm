#Criar um banco no docker e rodar o container:

docker run --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d --rm postgres:13.0

docker exec -it -u postgres my-postgres psql

Dentro do terminal criar o banco de dados a ser usado:

CREATE DATABASE test;

Rodar o comando npm run start:dev

Acesso ao db com typeorm
