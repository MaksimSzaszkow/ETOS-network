export default class Packet {
  priority;
  size;
  destination;

  constructor(
    priority: 1 | 2 | 3,
    size: number,
    destination: "Node1" | "Node2"
  ) {
    this.priority = priority;
    this.size = size;
    this.destination = destination;
  }
}
