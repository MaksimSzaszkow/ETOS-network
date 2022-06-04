import Packet from "./packet";

export default class Node {
  buffers;
  name;
  neighbour;

  constructor(name: "Node1" | "Node2", neighbour?: Node) {
    this.name = name;
    this.buffers = {
      "1": [] as Packet[],
      "2": [] as Packet[],
      "3": [] as Packet[],
    };
    this.neighbour = neighbour;
  }

  start() {
    this.handleQueue();
  }

  addPacket(packet: Packet) {
    this.buffers[packet.priority].push(packet);
  }

  private removePacket(priorityQueue: 1 | 2 | 3) {
    const packet = this.buffers[priorityQueue].pop();

    if (this.name === "Node1" && packet?.destination === "Node2")
      this.neighbour?.addPacket(packet);
    this.handleQueue();
  }

  private handleQueue() {
    let bufferKey: "1" | "2" | "3" | undefined;

    if (this.buffers["1"].length > 0) bufferKey = "1";
    else if (this.buffers["2"].length > 0) bufferKey = "2";
    else if (this.buffers["3"].length > 0) bufferKey = "3";

    if (bufferKey !== undefined) {
      const bufferLength = this.buffers[bufferKey].length;
      const lastPacket = this.buffers[bufferKey][bufferLength - 1];

      setTimeout(() => {
        this.removePacket(lastPacket.priority);
      }, lastPacket.size / 15);
    } else
      setTimeout(() => {
        this.handleQueue();
      }, 100);
  }
}
