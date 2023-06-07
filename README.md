# prompts
This project offers solutions for various scenarios involving OpenAI APIs and the utilization of prompts.

The initial feature allows for response caching when working in a development environment. This enables developers to work more efficiently and cost-effectively.

The second feature allows for the uploading of all prompt-related information, such as prompt templates, parameters, and responses, to a centralized server. This is typically done in production systems.

Having the information stored centrally allows for conducting experiments, such as modifying the prompt template and measuring performance, or transitioning to a different model version or provider and evaluating performance.

[It's recomended to read the concepts page](https://github.com/blinq-io/prompts/wiki/Concepts-page)

## Overall solution
The solution has 2 main components:
1. Client - the client uses the same APIs as the OpenAI and it serve as a proxy for the calls to OpenAI APIs. It operate in 2 modes: Development and Production. 
    When the client operate in development mode, it will cache the reponses into a local file. If the request is repeated the client will return the response from the cache without calling the OpenAI API.
    When the client operate in production mode, it will not cache, and optionally can send the request/response to a central server.
    [Clients folder](https://github.com/blinq-io/prompts/tree/main/clients).
2. Server - store the message request as well as the reponse and other information. It enable you to classify all the AI request into [AI API](https://github.com/blinq-io/prompts/wiki/Concepts-page) view statistics and run experiments on new prompt templates candidates.
