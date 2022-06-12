import {
  readdirSync,
  readFileSync,
  writeFileSync,
  rmdirSync,
  mkdirSync,
} from "node:fs";
import Simulator from "./classes/Simulator";
import { OnOffScenario, PoissonScenario } from "./interfaces/Scenario";
import { Parser } from "json2csv";

const files = readdirSync("./scenarios");

rmdirSync("./output", { recursive: true });
mkdirSync("./output");

for (let file of files) {
  let scenario: OnOffScenario | PoissonScenario = JSON.parse(
    readFileSync(`./scenarios/${file}`, "utf-8")
  );

  const simulation = new Simulator(scenario);

  const folderName = `./output/${file.substring(0, file.length - 5)}`;

  mkdirSync(folderName);

  const fields = [
    "id",
    "source",
    "arrivalTime",
    "departureTime",
    "serviceTime",
    "priority",
  ];

  const parser = new Parser({ fields });

  writeFileSync(`${folderName}/g1.csv`, parser.parse(simulation.g1.packets));
  writeFileSync(`${folderName}/g2.csv`, parser.parse(simulation.g2.packets));
  writeFileSync(`${folderName}/g3.csv`, parser.parse(simulation.g3.packets));
  writeFileSync(
    `${folderName}/node1_lifo.csv`,
    parser.parse(simulation.n1.processedPackets)
  );
  writeFileSync(
    `${folderName}/node2_lifo.csv`,
    parser.parse(simulation.n2.processedPackets)
  );
  writeFileSync(
    `${folderName}/node1_prio.csv`,
    parser.parse(simulation.n1prio.processedPackets)
  );
  writeFileSync(
    `${folderName}/node2_prio.csv`,
    parser.parse(simulation.n2prio.processedPackets)
  );
}
