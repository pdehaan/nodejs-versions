// import { Parser } from "xml2js";
// import * as Cheerio from "cheerio";
// import CachedFetch from "@11ty/eleventy-fetch";

// const feed = await parseFeed("https://nodejs.org/en/feed/vulnerability.xml");
// const items = getItems(feed.rss.channel[0].item);
// const notices = await fetchNotice(...items);

// const securityReleases = notices.reduce((acc, item) => acc.set(item.version, item), new Map());

import * as lib from "./lib.js";

const securityReleases = lib.securityReleases;
// console.log(securityReleases);

console.log("20.8.1", lib.isSecurityRelease(securityReleases, "20.8.1"));
console.log("20.8.0", lib.isSecurityRelease(securityReleases, "20.8.0"));

// async function fetchNotice(...items) {
//   const res = [];
//   let idx = 0;
//   for (const item of items) {
//     const html = await CachedFetch(item.link, {
//       type: "text",
//       duration: idx === 0 ? "10m" : "30d",
//     });
//     const $ = Cheerio.load(html);
//     const releases = $("h2#downloads-and-release-details + ul > li")
//       .map(function () {
//         const $release = $(this).find("a");
//         const href = $release.attr("href");
//         const text = $release.text().trim();
//         const re = href.match(/\/v(?<version>[\d\.]+)\/$/);
//         return { href, text, version: re?.groups.version, rss: item };
//       })
//       .get();
//     res.push(...releases);
//     idx++;
//   }
//   return res;
// }

// async function parseFeed(url) {
//   const xml = await CachedFetch(url, { type: "text", duration: "10m" });
//   return new Parser().parseStringPromise(xml);
// }

// function getItems(items = []) {
//   return items.flatMap((item) => {
//     return {
//       title: item.title[0],
//       link: item.link[0],
//       guid: item.guid[0],
//       pubDate: item.pubDate[0],
//       pubDate2: new Date(item.pubDate[0]),
//     };
//   });
// }

// function isSecurityRelease(securityReleases, version) {
//   return securityReleases.has(version);
// }
