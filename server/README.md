# Prompt server

The server of the prompt client, saves data in a database for later use.

# How to use:

The server uses a REST API with different routes:

- `/api/getPrompt` - POST request, gets an hashed message and returns the prompt that matches that hash:

  - takes a payload of a hashed message - `{ hash }`
  - returns the prompt that matches that hash
  - if a prompt doesn't exist returns an error message

- `/api/createPrompt` - POST request, saves a new prompt to the database:

  - takes a payload of a hashed message, parameters (if there are any) and the usual OpenAI's `createChatCompletion` and `createCompletion` parameters - `{hash, ...{OPENAI_PARAMS}}`
  - returns the newly created prompt
  - if a prompt already exist returns an error message

- `/api/updatePrompt` - PUT request, updates a prompt with the same hash:

  - takes a payload of a hashed message, parameters (if there are any) and the usual OpenAI's `createChatCompletion` and `createCompletion` parameters - `{hash, ...{OPENAI_PARAMS}}`
  - returns the newly updated prompt
  - if a prompt with that hash doesnt exist returns an error message
