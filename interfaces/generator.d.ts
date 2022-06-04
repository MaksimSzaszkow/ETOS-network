export default interface Generator {
  profileType: "ON/OFF" | "POISSON";
  packetSize: number;
  packetAmount: number;
}
