import { OnOffScenario, PoissonScenario } from "../interfaces/Scenario";
import LifoNode from "./LifoNode";
import OnOffGenerator from "./OnOffGenerator";
import Packet from "./Packet";
import PoissonGenerator from "./PoissonGenerator";
import PrioNode from "./PrioNode";

export default class Simulator {
  g1;
  g2;
  g3;
  n1;
  n2;
  n1prio;
  n2prio;

  constructor(scenario: OnOffScenario | PoissonScenario) {
    const packetsAmount = scenario.packetsPerGenerator;
    if (scenario.type === "ONOFF") {
      this.g1 = new OnOffGenerator(
        { ...scenario.generator1, source: 0 },
        packetsAmount
      );
      this.g2 = new OnOffGenerator(
        { ...scenario.generator2, source: 1 },
        packetsAmount
      );
      this.g3 = new OnOffGenerator(
        { ...scenario.generator3, source: 2 },
        packetsAmount
      );
    } else {
      this.g1 = new PoissonGenerator(
        { ...scenario.generator1, source: 0 },
        packetsAmount
      );
      this.g2 = new PoissonGenerator(
        { ...scenario.generator2, source: 1 },
        packetsAmount
      );
      this.g3 = new PoissonGenerator(
        { ...scenario.generator3, source: 2 },
        packetsAmount
      );
    }

    this.n1 = new LifoNode(
      [...this.g1.packets, ...this.g2.packets].sort(
        (a, b) => a.arrivalTime - b.arrivalTime
      )
    );

    this.n2 = new LifoNode(
      [
        ...this.n1.processedPackets
          .filter((packet) => packet.source === 0)
          .map(
            (packet) =>
              new Packet(
                packet.id,
                packet.departureTime,
                packet.serviceTime,
                packet.priority,
                packet.source
              )
          ),
        ...this.g3.packets,
      ].sort((a, b) => a.arrivalTime - b.arrivalTime)
    );

    this.n1prio = new PrioNode(
      [...this.g1.packets, ...this.g2.packets].sort(
        (a, b) => a.arrivalTime - b.arrivalTime
      )
    );

    this.n2prio = new PrioNode(
      [
        ...this.n1prio.processedPackets
          .filter((packet) => packet.source === 0)
          .map(
            (packet) =>
              new Packet(
                packet.id,
                packet.departureTime,
                packet.serviceTime,
                packet.priority,
                packet.source
              )
          ),
        ...this.g3.packets,
      ].sort((a, b) => a.arrivalTime - b.arrivalTime)
    );
  }
}
