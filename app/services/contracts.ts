import Deployments from "../config/deployments.json";

export function getContractAddress(key: keyof typeof Deployments): string {
  return Deployments[key];
}
