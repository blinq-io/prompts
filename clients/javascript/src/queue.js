const axios = require("axios");

exports.Queue = class Queue {
  static interval;

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

  static setQueueInterval(PromptProxy, serverURI, MAX_QUEUE_SIZE) {
    Queue.interval = setInterval(async () => {
      try {
        if (!PromptProxy.queue.isEmpty) {
          await axios.post(`${serverURI}/api/createPrompt`, {
            ...PromptProxy.queue.dequeue(),
          });
        }
      } catch (error) {
        if (PromptProxy.queue.length >= MAX_QUEUE_SIZE) {
          while (PromptProxy.queue >= MAX_QUEUE_SIZE) {
            PromptProxy.queue.dequeue();
          }
        }
      }
    }, 2000);
  }
};
