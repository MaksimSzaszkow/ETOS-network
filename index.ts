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
generator2.start();
generator3.start();

function displayStatus() {
  console.clear();
  console.log("Node1");
  console.log("buffer1: ", node1.buffers["1"].map(() => "|").join(" "));
  console.log("buffer2: ", node1.buffers["2"].map(() => "|").join(" "));
  console.log("buffer3: ", node1.buffers["3"].map(() => "|").join(" "));

  console.log("Node2");
  console.log("buffer1: ", node2.buffers["1"].map(() => "|").join(" "));
  console.log("buffer2: ", node2.buffers["2"].map(() => "|").join(" "));
  console.log("buffer3: ", node2.buffers["3"].map(() => "|").join(" "));
}

setInterval(displayStatus, 100);
