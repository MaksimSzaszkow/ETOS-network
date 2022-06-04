import { scenario } from "../interfaces/scenario";
import Packet from "./packet";
import Node from "../classes/node";

export default class Generator {
  private type;
  private packetAmount;
  private packetSize;
  private cycleTime;
  private onTime;
  private destination;
  private neighbour;

  constructor(profile: scenario, destination: Node, neighbour: Node) {
    const scenario = profile.split(" ");

    if (scenario.length == 5) {
      this.type = scenario[0];
      this.cycleTime = scenario[1];
      this.onTime = scenario[2];
      this.packetAmount = scenario[3];
      this.packetSize = scenario[4];
    } else {
      this.type = scenario[0];
      this.packetAmount = scenario[1];
      this.packetSize = scenario[2];
      this.cycleTime = "";
      this.onTime = "";
    }

    this.destination = destination;
    this.neighbour = neighbour;
  }

  start() {
    if (this.type === "ONOFF")
      setInterval(() => {
        this.createPackets();
      }, parseInt(this.cycleTime));
  }

  private createPackets() {
    for (let i = 0; i < parseInt(this.packetAmount); i++) {
      const priority = (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;
      const packet = new Packet(
        priority,
        parseInt(this.packetSize),
        this.destination.name
      );

      this.neighbour.addPacket(packet);
    }
  }
}
