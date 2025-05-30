import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { farcasterFrame as miniAppConnector } from "@farcaster/frame-wagmi-connector";
import abi from "@/ABIs/abi.json";

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [miniAppConnector()],
});

export const contractConfig = {
  address: "0x16008fD81f1FFf5B5Fb52A279778d187d69276fd",
  abi: abi,
} as const;

export const contextContractConfig = {
  address: "",
  chainId: 1,
} as const;
