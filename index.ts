import exampleScenario from "./scenarios/exampleScenario.json";
import Node from "./classes/node";
import Generator from "./classes/generator";
import { scenario } from "./interfaces/scenario";

const node2 = new Node("Node2");
const node1 = new Node("Node1", node2);

const generator1 = new Generator(
  exampleScenario.g1Profile as scenario,
  node2,
  node1
);
const generator2 = new Generator(
  exampleScenario.g1Profile as scenario,
  node1,
  node1
);
const generator3 = new Generator(
  exampleScenario.g1Profile as scenario,
  node2,
  node2
);

node1.start();
node2.start();

generator1.start();
