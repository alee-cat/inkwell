// server/src/events/listeners/count-published-posts.listener.js

import { EventBus } from 'eventbusjs';

let publishedPostCount = 0;

EventBus.on("post.published", () => {
    publishedPostCount++;
});

export function getPublishedPostCount() {
    return publishedPostCount;
}