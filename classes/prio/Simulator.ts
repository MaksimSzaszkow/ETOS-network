import Generator from "./Generator";
import Node from "./Node";
import SuppliedGenerator from "./SuppliedGenerator";

export default class Simulator {
  meanPacketCount = 80;
  meanServiceTime = 0.01;

  generator1 = new Generator(this.meanPacketCount, this.meanServiceTime);
  node1 = new Node();
  generator2 = new SuppliedGenerator(
    this.meanPacketCount,
    this.meanServiceTime,
    this.node1.extraPackets0,
    this.node1.extraPackets1
  );
  node2 = new Node();

  start() {
    const packetAmount = 100000;
    let lastPacketArrival1 = 0;
    let lastPacketArrival2 = 0;

    while (
      this.node1.processedPackets < packetAmount ||
      this.node2.processedPackets < packetAmount
    ) {
      while (
        this.generator1.generatedPackets < packetAmount &&
        (this.node1.buffer.length === 0 ||
          lastPacketArrival1 < this.node1.simulationTime)
      ) {
        const packet = this.generator1.generateNext();

        this.node1.buffer.push(packet);
        lastPacketArrival1 = packet.arrivalTime;
      }

      if (this.node1.buffer.length) this.node1.processPacket();

      while (
        this.generator2.generatedPackets < packetAmount &&
        (lastPacketArrival2 < this.node2.simulationTime ||
          this.node2.buffer.length === 0)
      ) {
        const packet = this.generator2.generateNext();
        if (packet) {
          this.node2.buffer.push(packet);
          lastPacketArrival2 = packet.arrivalTime;
        } else break;
      }

      if (
        this.node2.buffer.length &&
        (this.node2.buffer[this.node2.buffer.length - 1].arrivalTime >=
          this.node2.simulationTime ||
          this.node1.processedPackets === packetAmount)
      )
        this.node2.processPacket();
    }

    console.log(
      this.generator1.source0GeneratedPackets,
      this.generator1.generatedPackets
    );
    console.log(
      this.generator2.source0GeneratedPackets,
      this.generator2.generatedPackets
    );
    console.log({
      node1: {
        ro: 1 - this.node1.idleTime / this.node1.simulationTime,
        avgWaitTime: this.node1.waitTime / this.node1.processedPackets,
        avgWaitTimeSource0:
          this.node1.waitTimes[0] / this.generator1.source0GeneratedPackets,
        avgWaitTimesSource1:
          this.node1.waitTimes[1] /
          (this.generator1.generatedPackets -
            this.generator1.source0GeneratedPackets),
        avgPacketCount: this.node1.waitTime / this.node1.simulationTime,
      },
      node2: {
        ro: 1 - this.node2.idleTime / this.node2.simulationTime,
        avgWaitTime: this.node2.waitTime / this.node2.processedPackets,
        avgWaitTimeSource0:
          this.node2.waitTimes[0] / this.generator2.source0GeneratedPackets,
        avgWaitTimesSource1:
          this.node2.waitTimes[1] /
          (this.generator2.generatedPackets -
            this.generator2.source0GeneratedPackets),
        avgPacketCount: this.node2.waitTime / this.node2.simulationTime,
      },
      bufferStats: {
        avgWaitTime:
          (this.node1.waitTime / this.node1.processedPackets +
            this.node2.waitTime / this.node2.processedPackets) /
          2,
      },
    });

    return {
      node1: {
        ro: 1 - this.node1.idleTime / this.node1.simulationTime,
        avgWaitTime: this.node1.waitTime / this.node1.processedPackets,
        avgPacketCount: this.node1.waitTime / this.node1.simulationTime,
      },
      node2: {
        ro: 1 - this.node2.idleTime / this.node2.simulationTime,
        avgWaitTime: this.node2.waitTime / this.node2.processedPackets,
        avgPacketCount: this.node2.waitTime / this.node2.simulationTime,
      },
    };
  }
}
