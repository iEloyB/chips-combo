import { readQueues } from "../classes/Queue.js";

readQueues().then((queues) => {
  console.log(queues);
  if (!queues) {
    console.log("no queues");
  }
});
