import { readdirSync, readFileSync } from "node:fs";
import Simulator from "./classes/Simulator";
import { OnOffScenario, PoissonScenario } from "./interfaces/Scenario";

const files = readdirSync("./scenarios");

for (let file of files) {
  let scenario: OnOffScenario | PoissonScenario = JSON.parse(
    readFileSync(`./scenarios/${file}`, "utf-8")
  );

  new Simulator(scenario);
}
