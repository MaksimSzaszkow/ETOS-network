type onoff = `ON/OFF ${number} ${number} ${number} ${number}`;
type poisson = `POISSON ${number} ${number}`;
type percentage = `${number | ""}${number | ""}${number}%`;
export type scenario = poisson | onoff;
type priorities = `${percentage} | ${percentage} | ${percentage}`;

export default interface Scenario {
  g1Profile: scenario;
  g1Priorities: priorities;
  g2Profile: scenario;
  g2Priorities: priorities;
  g3Profile: scenario;
  g3Priorities: priorities;
}
