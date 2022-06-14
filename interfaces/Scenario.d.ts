export interface OnOffScenario {
  type: "ONOFF";
  packetsPerGenerator: number;
  generator1: OnOffGeneratorConfig;
  generator2: OnOffGeneratorConfig;
  generator3: OnOffGeneratorConfig;
}

export interface GeneratorConfig {
  // Amount of packets generated per second (generation speed)
  packetCount: number;
  // Amount of time packet is processed by node
  meanServiceTime: number;
  // Priorities breakdown (in %)
  priorities: string;
  source: 0 | 1 | 2;
}

export interface OnOffGeneratorConfig extends GeneratorConfig {
  // Amount of packets after which happens break lasting Toff time
  tonPacketAmount: number;
  // Length of break after Ton worth of packets are generated
  toffTime: number;
}

export interface PoissonScenario {
  type: "POISSON";
  packetsPerGenerator: number;
  generator1: PoissonGeneratorConfgi;
  generator2: PoissonGeneratorConfgi;
  generator3: PoissonGeneratorConfgi;
}
