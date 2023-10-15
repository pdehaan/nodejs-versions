import { Parser } from "xml2js";
import * as Cheerio from "cheerio";
import CachedFetch from "@11ty/eleventy-fetch";
import semver from "semver";

export const vulnerabilities = await parseFeed("https://nodejs.org/en/feed/vulnerability.xml");
const items = getItems(vulnerabilities.rss.channel[0].item);
const notices = await fetchNotice(...items);

export const securityReleases = notices.reduce((acc, item) => acc.set(item.version, item), new Map());

export function isSecurityRelease(version) {
  return securityReleases.has(version.replace(/^v/i, ""));
}

export async function getReleases() {
  const feed = await parseFeed("https://nodejs.org/en/feed/releases.xml");
  return feed.rss.channel[0].item.map(item => {
    const $item = Object.entries(item).reduce((acc, [k, v]) => {
      acc[k] = v.pop();
      return acc;
    }, {});
    const $version = $item.link.split("/").pop();
    const { major, minor, patch, version } = semver.parse($version);
    $item.version = version;
    $item.security = isSecurityRelease(version);
    $item.semver = { major, minor, patch };
    return $item;
  });
}

export async function fetchNotice(...items) {
  const res = [];
  let idx = 0;
  for (const item of items) {
    const html = await CachedFetch(item.link, {
      type: "text",
      duration: idx === 0 ? "10m" : "30d",
    });
    const $ = Cheerio.load(html);
    const releases = $("h2#downloads-and-release-details + ul > li")
      .map(function () {
        const $release = $(this).find("a");
        const href = $release.attr("href");
        const text = $release.text().trim();
        const re = href.match(/\/v(?<version>[\d\.]+)\/$/);
        const version = re?.groups.version;
        return { href, text, version, rss: item };
      })
      .get();
    res.push(...releases);
    idx++;
  }
  return res;
}

export async function parseFeed(url, duration = "10m") {
  const xml = await CachedFetch(url, { type: "text", duration });
  return new Parser().parseStringPromise(xml);
}

export function getItems(items = []) {
  return items.flatMap((item) => {
    return {
      title: item.title[0],
      link: item.link[0],
      guid: item.guid[0],
      pubDate: item.pubDate[0],
      pubDate2: new Date(item.pubDate[0]),
    };
  });
}

