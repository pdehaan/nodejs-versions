import * as lib from "./lib.js";
import semver from "semver";

const MAJOR = parseInt(process.env.MAJOR ?? process.argv.slice(2).at(0), 10);

let releases = lib.releases.rss.channel[0].item.map(item => {
  const $item = Object.entries(item).reduce((acc, [k, v]) => {
    acc[k] = v.pop();
    return acc;
  }, []);
  $item.version = $item.link.split("/").pop();
  $item.semver = semver.parse($item.version);
  $item.security = isSecurityRelease($item.version)
  return $item;
});

if (isNaN(MAJOR)) {
  releases = releases.slice(0, 25);
} else {
  releases = releases.filter(item => item.semver.major === MAJOR);
}

for (const release of releases) {
  console.log(`${release.title}\t${new Date(release.pubDate).toLocaleDateString()}${lib.isSecurityRelease(release.version) ? " (SECURITY RELEASE)": ""}`.trim());
}

// const feed = await parseFeed("https://nodejs.org/en/feed/releases.xml");

// const items = releases.rss.channel
//   .at(0)
//   .item.map((item) => {
//     const $item = Object.entries(item).reduce((acc, [k, v]) => {
//       acc[k] = v.pop();
//       return acc;
//     });
//     $item.guid = $item.guid.replace("/blog/release/", "");
//     $item.semver = semver.parse($item.guid);
//     return $item;
//   })
//   .filter((i) => !isNaN(MAJOR) ? i.semver.major === MAJOR : true)
//   .slice(0, 20);

// items.forEach(i => console.log(i)); //`${i} - ${new Date(i.pubDate).toLocaleDateString()}`));
