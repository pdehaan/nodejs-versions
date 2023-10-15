import CachedFetch from "@11ty/eleventy-fetch";
import * as Cheerio from "cheerio";
import semver from "semver";
import * as lib from "./lib.js";

const channels = await getActiveChannels();

for (const c of channels) {
  console.log(c.title);
  for (const r of c.releases) {
    console.log(`${r.title} ${new Date(r.pubDate).toLocaleDateString()} ${r.security ? "(SECURITY)": ""}`.trim());
  }
  console.log();
}

async function getActiveChannels(duration = "1h") {
  const html = await CachedFetch("https://nodejs.org/en", {
    type: "text",
    duration,
  });
  const $ = Cheerio.load(html);
  const channels = $("div.home-downloadblock > a");
  const $releases = await lib.getReleases();

  return channels
    .map(function () {
      const $c = $(this);
      const title = $c
        .attr("title")
        .replace(/^Download\s/, "")
        .trim();
      const version = $c.attr("data-version");
      const { major } = semver.parse(version);
      const releases = $releases.filter(r => r.semver.major === major);
      return { title, version, major, releases };
    })
    .get();
}
