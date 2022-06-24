import SimulatorMM1 from "./classes/mm1/Simulator";
import SimulatorLIFO from "./classes/lifo/Simulator";
import SimulatorPRIO from "./classes/prio/Simulator";
import SimulatorPRIOONOFF from "./classes/prioOnOff/Simulator";
import { Parser } from "json2csv";
import { writeFileSync, rmdirSync, mkdirSync, existsSync } from "node:fs";

const mm1 = [new SimulatorMM1().start()];
const lifo = [new SimulatorLIFO().start()];
const prio = [new SimulatorPRIO().start()];
const prioOnOff = [new SimulatorPRIOONOFF().start()];

for (let i = 0; i < 0; i++) {
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
