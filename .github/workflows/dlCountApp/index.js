async function main() {
  const fs = require("fs");
  const path = require("path");
  const asyncForEach = require("for-async-each");

  fs.copyFileSync(path.join(__dirname, "node_modules/gh-releases-stats/lib/utils.js"), path.join(__dirname, "node_modules/gh-releases-stats/lib/utils-modified.js"));
  let utilContent = fs.readFileSync(path.join(__dirname, "node_modules/gh-releases-stats/lib/utils-modified.js")).toString("utf8");
  if (process.env.GITHUB_TOKEN)
    utilContent = utilContent.replace(`"User-Agent": USER_AGENT`, `"User-Agent": USER_AGENT, "authorization": "Bearer ${process.env.GITHUB_TOKEN}"`);

  fs.writeFileSync(path.join(__dirname, "node_modules/gh-releases-stats/lib/utils-modified.js"), utilContent);

  const utils = require("gh-releases-stats/lib/utils-modified.js");

  const getReleaseInfoByType = function (repo, cb) {
    utils.getReleasesInfo(repo, function (err, releases) {
      if (err) {
        cb(err);
      } else {
        let map = utils.sum.assetTypeDownloadCounts(releases);
        cb(null, map);
      }
    });
  };

  const modules = require(path.join(__dirname, "../../../data/modules.json"));
  let out = {};

  await asyncForEach(modules, async (module) => {
    await new Promise((resolve) => {
      getReleaseInfoByType(module.repository, (_err, typesDict) => {
        out[module.repository] = typesDict.zip.downloadCount;
        resolve();
      });
    });
  });

  if (!fs.existsSync(path.join(__dirname, "../../../out"))) fs.mkdirSync(path.join(__dirname, "../../../out"));
  fs.writeFileSync(path.join(__dirname, "../../../out/downloads.json"), JSON.stringify(out));

  if (fs.existsSync(path.join(__dirname, "node_modules/gh-releases-stats/lib/utils-modified.js")))
    fs.rmSync(path.join(__dirname, "node_modules/gh-releases-stats/lib/utils-modified.js"));
}

main();
