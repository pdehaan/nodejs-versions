import { Builder, Parser } from "xml2js";

const feed = await parseFeed("https://nodejs.org/en/feed/vulnerability.xml");

const xml = await buildFeed(feed /* "https://nodejs.org/en/feed/vulnerability.xml" */, 3);
console.log(xml);

async function parseFeed(url) {
  const xml = await fetch(url).then((r) => r.text());
  return new Parser().parseStringPromise(xml);
}

async function buildFeed(feedOrUrl, maxItems = 10) {
  let feed = feedOrUrl;
  if (typeof feedOrUrl === "string") {
    feed = await parseFeed(feedOrUrl);
  }
  feed.rss.channel[0].item = feed.rss.channel[0].item
    .slice(0, maxItems)
    .map((item) => cacheBuster(item));
  return new Builder().buildObject(feed);
}

function cacheBuster(item) {
  const guid = new URL(item.link[0]);
  // Add cache busting hash to the `guid`.
  guid.hash = Date.parse(item.pubDate);
  item.guid[0] = guid.href;
  return item;
}
