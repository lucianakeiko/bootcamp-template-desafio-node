const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

app.use('/repositories/:id', ValidadeRepositoryId);

const repositories = [];

function ValidadeRepositoryId(request, response, next) {
  const { id } = request.params;
  if(!isUuid(id)){
    return response.status(400).json({ error : "invalid Repository ID"});
  }
  return next();
}

app.get("/repositories", (request, response) => {
  // TODO 🏆 Lista
  
  return response.json(repositories);
  
});

app.post("/repositories", (request, response) => {
  // TODO 🏆 Cadastro 
  const { title, url, techs } = request.body;

  const repository = { id : uuid() , title , url , techs , likes : 0 } 

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  // TODO - 🏆 Edição

  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0 ) {
    return response.status(400).json({ error: "Repository does not exist "});
  }

  const repository = { 
    id,
    title,
    url,
    techs,
    likes : repositories[repositoryIndex].likes, 
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", ValidadeRepositoryId, (request, response) => {
  // TODO - 🏆 Remoção  

  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository =>  repository.id === id);

  if( repositoryIndex < 0 ) {
    return response.status(400).json(' error : Repository not found.');
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  // TODO - 🏆 Like

  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id);

  if (repositoryIndex < 0 ) {
    return response.status(400).json({ error : "Repository does not exists "});
  }

  repositories[repositoryIndex].likes += 1;
  
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
