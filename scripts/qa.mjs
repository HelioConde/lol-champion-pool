import fs from "node:fs";
import assert from "node:assert/strict";

const html=fs.readFileSync("index.html","utf8");
const css=fs.readFileSync("style.css","utf8");
const app=fs.readFileSync("app.js","utf8");
const backend=fs.readFileSync("backend-config.js","utf8");

assert.match(html,/id="lookup-form"/);
assert.match(html,/id="champion-grid"/);
assert.match(html,/id="saved-pool"/);
assert.match(html,/data-role="MID"/);
assert.match(css,/@media\(max-width:680px\)/);
assert.match(css,/focus-visible/);
assert.match(app,/buildChampions/);
assert.match(app,/togglePool/);
assert.match(app,/POOL_KEY/);
assert.match(app,/RANKED/);
assert.match(backend,/public-lol-profile/);
assert.ok(fs.existsSync("sobre.html"));
assert.ok(fs.existsSync("privacidade.html"));
assert.ok(fs.existsSync("termos.html"));

console.log("LoL Champion Pool static QA passed");