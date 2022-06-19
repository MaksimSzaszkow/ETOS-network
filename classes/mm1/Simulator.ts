import Generator from "./Generator";
import Node from "./Node";
import Packet from "./Packet";

export default class Simulator {
  generator;
  node;

  packetsInBuffer = 0;
  packetsInBufferTime = 0;

  constructor() {
    this.generator = new Generator(2, 0.25);
    this.node = new Node();
  }

  start() {
    const packetAmount = 100000;
    const processedPackets: Packet[] = [];
    let lastSegmentStartTime = 0;

    while (processedPackets.length < packetAmount) {
      let lastPacketArrival = 0;
      while (
        lastPacketArrival < this.node.simulationTime ||
        this.node.buffor.length === 0
      ) {
        const packet = this.generator.generateNext();

        this.node.buffor.push(packet);
        lastPacketArrival = packet.arrivalTime;

        const newLastSegemntTime = Math.max(
          packet.arrivalTime,
          this.node.simulationTime
        );

        this.packetsInBuffer +=
          (newLastSegemntTime - lastSegmentStartTime) *
          packetWaitTime

        console.log(newLastSegemntTime - lastSegmentStartTime);
        this.packetsInBufferTime += newLastSegemntTime - lastSegmentStartTime;
        lastSegmentStartTime = newLastSegemntTime;
      }

      processedPackets.push(this.node.processPacket());
    }

    console.log(`RO: ${1 - this.node.idleTime / this.node.simulationTime}`);
    console.log(`AVG WAIT: ${this.node.waitTime / processedPackets.length}`);
    console.log(
      `AVG IN QUEUE: ${this.packetsInBuffer / this.node.simulationTime}`
    );
  }
}
