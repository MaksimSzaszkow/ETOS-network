import Packet from "./Packet";
import Simulator from "./Simulator";

export default class Node {
  private buffers: Packet[][] = [[], [], []];
  private network;
  private simulator;

  busyUntil = 0;

  constructor(network: { [key: string]: Node }, simulator: Simulator) {
    this.network = network;
    this.simulator = simulator;
  }

  addPacket(packet: Packet) {
    this.buffers[packet.priority].push(packet);
  }
}
