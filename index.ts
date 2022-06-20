// import {
//   readdirSync,
//   readFileSync,
//   writeFileSync,
//   rmdirSync,
//   mkdirSync,
//   existsSync,
// } from "node:fs";
// import Simulator from "./classes/old/Simulator";
// import { OnOffScenario, PoissonScenario } from "./interfaces/Scenario";
// import { Parser } from "json2csv";
// import Node from "./classes/old/Node";
// import PrioNode from "./classes/old/PrioNode";

// const files = readdirSync("./scenarios");

// if (existsSync("./output")) rmdirSync("./output", { recursive: true });
// mkdirSync("./output");

// for (let file of files) {
//   let scenario: OnOffScenario | PoissonScenario = JSON.parse(
//     readFileSync(`./scenarios/${file}`, "utf-8")
//   );

//   const simulation = new Simulator(scenario);

//   const folderName = `./output/${file.substring(0, file.length - 5)}`;

//   mkdirSync(folderName);

//   const packetFields = [
//     "id",
//     "source",
//     "arrivalTime",
//     "departureTime",
//     "serviceTime",
//     "priority",
//   ];

//   const packetParser = new Parser({ fields: packetFields });

//   writeFileSync(
//     `${folderName}/g1.csv`,
//     packetParser.parse(simulation.g1.packets)
//   );
//   writeFileSync(
//     `${folderName}/g2.csv`,
//     packetParser.parse(simulation.g2.packets)
//   );
//   writeFileSync(
//     `${folderName}/g3.csv`,
//     packetParser.parse(simulation.g3.packets)
//   );
//   writeFileSync(
//     `${folderName}/node1_lifo.csv`,
//     packetParser.parse(simulation.n1.processedPackets)
//   );
//   writeFileSync(
//     `${folderName}/node2_lifo.csv`,
//     packetParser.parse(simulation.n2.processedPackets)
//   );
//   writeFileSync(
//     `${folderName}/node1_prio.csv`,
//     packetParser.parse(simulation.n1prio.processedPackets)
//   );
//   writeFileSync(
//     `${folderName}/node2_prio.csv`,
//     packetParser.parse(simulation.n2prio.processedPackets)
//   );

//   const simulationFields = [
//     "ServerUtilization",
//     "AvgPacketCount",
//     "AvgWaitTime",
//   ];
//   const simulationParser = new Parser({
//     fields: simulationFields,
//   });

//   const n1 = simulationParser.parse(getNodeStats(simulation.n1));
//   writeFileSync(`${folderName}/node1_lifo_simulation_stats.csv`, n1);

//   const n1prio = simulationParser.parse(getNodeStats(simulation.n1prio));
//   writeFileSync(`${folderName}/node1_prio_simulation_stats.csv`, n1prio);

//   const n2 = simulationParser.parse(getNodeStats(simulation.n2));
//   writeFileSync(`${folderName}/node2_lifo_simulation_stats.csv`, n2);

//   const n2prio = simulationParser.parse(getNodeStats(simulation.n2prio));
//   writeFileSync(
//     `${folderName}/node2_prio_simulation_stats.csv`,
//     simulationParser.parse(n2prio)
//   );

//   const bufferFields = ["AvgPacketCount", "AvgWaitTime"];
//   const bufferParser = new Parser({
//     fields: bufferFields,
//   });

//   for (let i = 0; i < 3; i++) {
//     const bufferData = bufferParser.parse(
//       getBufferStats(simulation.n1prio, i as 0 | 1 | 2)
//     );
//     writeFileSync(
//       `${folderName}/node1_buffer${i}_simulation_stats.csv`,
//       bufferData
//     );
//   }

//   for (let i = 0; i < 3; i++) {
//     const bufferData = bufferParser.parse(
//       getBufferStats(simulation.n2prio, i as 0 | 1 | 2)
//     );
//     writeFileSync(
//       `${folderName}/node1_buffer${i}_simulation_stats.csv`,
//       bufferData
//     );
//   }
// }

// function getNodeStats(node: Node) {
//   return {
//     ServerUtilization: 1 - node.idleTime / node.simulationTime,
//     AvgPacketCount: node.packetCountInBuffer / node.processedPackets.length,
//     AvgWaitTime: (node.packetWaitTime / node.processedPackets.length) * 2,
//   };
// }

// function getBufferStats(node: PrioNode, buffer: 0 | 1 | 2) {
//   return {
//     AvgPacketCount:
//       node.packetCountInBuffers[buffer] / node.packetCountPerBuffer[buffer],
//     AvgWaitTime:
//       node.packetWaitTimeBuffers[buffer] / node.packetCountPerBuffer[buffer],
//   };
// }

import SimulatorMM1 from "./classes/mm1/Simulator";
import SimulatorLIFO from "./classes/lifo/Simulator";
import SimulatorPRIO from "./classes/prio/Simulator";
import SimulatorPRIOONOFF from "./classes/prioOnOff/Simulator";
import { Parser } from "json2csv";
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  rmdirSync,
  mkdirSync,
  existsSync,
} from "node:fs";

const mm1Stats = {
  ro: [],
  avgWaitTime: [],
  avgPacketCount: [],
};

const lifoStats = {
  ro: [],
  avgWaitTime: [],
  avgPacketCount: [],
};

const prioStats = {
  ro: [],
  avgWaitTime: [],
  avgPacketCount: [],
};

const mm1 = [new SimulatorMM1().start()];
const lifo = [new SimulatorLIFO().start()];
const prio = [new SimulatorPRIO().start()];
const prioOnOff = [new SimulatorPRIOONOFF().start()];

for (let i = 0; i < 99; i++) {
  mm1.push(new SimulatorMM1().start());
  lifo.push(new SimulatorLIFO().start());
  prio.push(new SimulatorPRIO().start());
  prioOnOff.push(new SimulatorPRIOONOFF().start());
}

const shortStats = ["ro", "avgWaitTime", "avgPacketCount"];
const shortStatsParser = new Parser({
  fields: shortStats,
});
const longStats = [
  "ro",
  "avgWaitTime",
  "avgWaitTime0",
  "avgWaitTime1",
  "avgWaitTime2",
  "avgPacketCount",
  "avgPacketCount0",
  "avgPacketCount1",
  "avgPacketCount2",
];
const longStatsParser = new Parser({
  fields: longStats,
});

if (existsSync("./output")) rmdirSync("./output", { recursive: true });
mkdirSync("./output");

const mm1Folder = "./output/mm1";
const lifoFolder = "./output/lifo";
const prioFolder = "./output/prio";
const prioOnOffFolder = "./output/prioOnOff";

mkdirSync(mm1Folder);
mkdirSync(lifoFolder);
mkdirSync(prioFolder);
mkdirSync(prioOnOffFolder);

writeFileSync(`${mm1Folder}/stats.csv`, shortStatsParser.parse(mm1));
writeFileSync(`${lifoFolder}/stats.csv`, shortStatsParser.parse(lifo));
writeFileSync(`${prioFolder}/stats.csv`, longStatsParser.parse(prio));
writeFileSync(`${prioOnOffFolder}/stats.csv`, longStatsParser.parse(prioOnOff));
