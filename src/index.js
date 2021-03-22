const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

// Utils Functions
function isAcceptField(field) {
  const acceptedFields = ['title', 'url', 'techs'];

  return acceptedFields.includes(field);
}

function mountUpdatablesValues(object) {
  const acceptedFields = Object
    .keys(object)
    .filter(key => object[key] !== undefined && isAcceptField(key));

  const acceptedValues = {};

  for (const field of acceptedFields) {
    acceptedValues[field] = object[field];
  }

  return acceptedValues;
}

// Routes
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const updatedRepository = mountUpdatablesValues(request.body);

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if(repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories[repositoryIndex] = { ...repositories[repositoryIndex], ...updatedRepository };

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json({ likes });
});

module.exports = app;
