import {
  readdirSync,
  readFileSync,
  writeFileSync,
  rmdirSync,
  mkdirSync,
  existsSync,
} from "node:fs";
import Simulator from "./classes/Simulator";
import { OnOffScenario, PoissonScenario } from "./interfaces/Scenario";
import { Parser } from "json2csv";

const files = readdirSync("./scenarios");

if (existsSync("./output")) rmdirSync("./output", { recursive: true });
mkdirSync("./output");

for (let file of files) {
  let scenario: OnOffScenario | PoissonScenario = JSON.parse(
    readFileSync(`./scenarios/${file}`, "utf-8")
  );

  const simulation = new Simulator(scenario);

  const folderName = `./output/${file.substring(0, file.length - 5)}`;

  mkdirSync(folderName);

  const packetFields = [
    "id",
    "source",
    "arrivalTime",
    "departureTime",
    "serviceTime",
    "priority",
  ];

  const packetParser = new Parser({ fields: packetFields });

  writeFileSync(
    `${folderName}/g1.csv`,
    packetParser.parse(simulation.g1.packets)
  );
  writeFileSync(
    `${folderName}/g2.csv`,
    packetParser.parse(simulation.g2.packets)
  );
  writeFileSync(
    `${folderName}/g3.csv`,
    packetParser.parse(simulation.g3.packets)
  );
  writeFileSync(
    `${folderName}/node1_lifo.csv`,
    packetParser.parse(simulation.n1.processedPackets)
  );
  writeFileSync(
    `${folderName}/node2_lifo.csv`,
    packetParser.parse(simulation.n2.processedPackets)
  );
  writeFileSync(
    `${folderName}/node1_prio.csv`,
    packetParser.parse(simulation.n1prio.processedPackets)
  );
  writeFileSync(
    `${folderName}/node2_prio.csv`,
    packetParser.parse(simulation.n2prio.processedPackets)
  );

  const simulationFields = ["simulationTime", "idleTime", "delayTime"];
  const simulationParser = new Parser({ fields: simulationFields });

  writeFileSync(
    `${folderName}/node1_lifo_simulation_stats.csv`,
    simulationParser.parse({
      simulationTime: simulation.n1.simulationTime,
      idleTime: simulation.n1.idleTime,
      delayTime: simulation.n1.delayTime,
    })
  );

  writeFileSync(
    `${folderName}/node1_prio_simulation_stats.csv`,
    simulationParser.parse({
      simulationTime: simulation.n1prio.simulationTime,
      idleTime: simulation.n1prio.idleTime,
      delayTime: simulation.n2prio.delayTime,
    })
  );

  writeFileSync(
    `${folderName}/node2_lifo_simulation_stats.csv`,
    simulationParser.parse({
      simulationTime: simulation.n2.simulationTime,
      idleTime: simulation.n2.idleTime,
      delayTime: simulation.n2.delayTime,
    })
  );

  writeFileSync(
    `${folderName}/node2_prio_simulation_stats.csv`,
    simulationParser.parse({
      simulationTime: simulation.n2prio.simulationTime,
      idleTime: simulation.n2prio.idleTime,
      delayTime: simulation.n2prio.delayTime,
    })
  );
}
