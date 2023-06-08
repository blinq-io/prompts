const { PromptProxy } = require("./prompt");

exports.Queue = class Queue {
  constructor() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }
  enqueue(element) {
    this.elements[this.tail] = element;
    this.tail++;
  }
  dequeue() {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }
  peek() {
    return this.elements[this.head];
  }
  get length() {
    return this.tail - this.head;
  }
  get isEmpty() {
    return this.length === 0;
  }

  setQueueInterval(MAX_QUEUE_SIZE) {
    if (!MAX_QUEUE_SIZE) {
      MAX_QUEUE_SIZE = 100;
    }

    PromptProxy.isInterval = true;
    setInterval(async () => {
      try {
        if (!PromptProxy.queue.isEmpty) {
          await axios.post(`${this.serverURI}/api/createPrompt`, {
            ...PromptProxy.queue.dequeue(),
          });
        }
      } catch (error) {
        if (PromptProxy.queue.length >= MAX_QUEUE_SIZE) {
          while (PromptProxy.queue >= MAX_QUEUE_SIZE) {
            PromptProxy.queue.dequeue();
          }
        }
        console.log("Can't access server!");
      }
    }, 2000);
  }
};
