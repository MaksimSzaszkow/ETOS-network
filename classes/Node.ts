import Packet from "./Packet";

export default class Node {
  simulationTime = 0;
  packets;
  processedPackets: Packet[] = [];

  idleTime = 0;
  delayTime = 0;

  Ti = 0;
  Tn = 0;
  Qn = 0;

  constructor(packets: Packet[]) {
    this.packets = packets;
  }

  processPacket(packet: Packet | undefined) {
    if (packet) {
      const index = this.packets.indexOf(packet);
      this.packets.splice(index, 1);

      this.simulationTime += packet.serviceTime;
      packet.departureTime = this.simulationTime;

      this.processedPackets.push(packet);
      this.delayTime +=
        this.simulationTime - packet.arrivalTime - packet.serviceTime;
    } else {
      this.idleTime += this.packets[0].arrivalTime - this.simulationTime;
      this.simulationTime = this.packets[0].arrivalTime;
    }
  }

  calculateQn() {
    let lastDepartureTime = 0;
    this.processedPackets
      .sort((a, b) => a.departureTime - b.departureTime)
      .forEach((processedPacket) => {
        const packetsInBuffer = this.processedPackets
          .filter(
            (packet) =>
              packet.arrivalTime < processedPacket.departureTime &&
              packet.departureTime > processedPacket.departureTime
          )
          .sort((a, b) => a.arrivalTime - b.arrivalTime);

        let amountOfPacketsInBuffer = 0;

        packetsInBuffer.forEach((bufferPacket, index) => {
          amountOfPacketsInBuffer++;
          let timeWindow = 0;

          if (index < packetsInBuffer.length - 1) {
            timeWindow =
              Math.max(
                packetsInBuffer[index + 1].arrivalTime,
                lastDepartureTime
              ) - Math.max(bufferPacket.arrivalTime, lastDepartureTime);
          } else {
            timeWindow =
              Math.max(processedPacket.departureTime, lastDepartureTime) -
              Math.max(bufferPacket.arrivalTime, lastDepartureTime);
          }

          this.Ti += timeWindow * amountOfPacketsInBuffer;
          this.Tn += timeWindow;
        });
        lastDepartureTime = processedPacket.departureTime;
      });

    this.Qn = this.Ti / this.Tn;
  }
}
