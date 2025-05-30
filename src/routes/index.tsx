import { createFileRoute } from "@tanstack/react-router";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { sdk } from "@farcaster/frame-sdk";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { encodeFunctionData } from "viem";
import { contractConfig } from "@/config/wagmiConfig";
import {
  ChevronRight,
  CircleX,
  Loader2,
  SendHorizonal,
  Wallet,
} from "lucide-react";
import { capitalizeWords } from "@/lib/utils";
// @ts-expect-error: No type declaration for the module
import { M3terHead, m3terAlias } from "m3ters";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppContext } from "@/store/app.store";
import { useAccount, useConnect } from "wagmi";

const ENERGY_PRICE_PER_KWH = 0.06;
const PRESET_AMOUNTS = [1, 2, 5, 10, 20, 50, 100];

const frame = {
  version: "next",
  imageUrl: `https://watt-a-frame.vercel.app/watt-a-frame.webp`,
  button: {
    title: "Launch Frame",
    action: {
      type: "launch_frame",
      name: "Watt-A-Frame",
      url: "https://watt-a-frame.vercel.app",
      splashImageUrl: `https://watt-a-frame.vercel.app/lightbulb.png`,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

type IndexSearchParams = {
  id?: string;
  amount?: string;
};

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: (search: Record<string, unknown>): IndexSearchParams => {
    return {
      id: search.id ? (search.id as string) : undefined,
      amount: search.amount ? (search.amount as string) : undefined,
    };
  },
});

function Index() {
  const { id, amount } = Route.useSearch();
  const [customAmount, setCustomAmount] = useState(amount || "");
  const [selectedAmounts, setSelectedAmounts] = useState<number[]>([]);
  const { data: hash, sendTransaction } = useSendTransaction();

  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const {
    setAvatarTransitioned,

    tokenId,
    setTokenId,
    setStep,
    step,
    setSlideOpen,
    slideOpen,
  } = useAppContext();

  useEffect(() => {
    if (id) setTokenId(id);
  }, [id, setTokenId]);

  const lastTokenId = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => localStorage.getItem("lastTokenId"),
    () => "" // Server-side render fallback
  );

  useEffect(() => {
    if (lastTokenId) {
      setTokenId(lastTokenId);
      setStep(2);
      setAvatarTransitioned(true);
    }
  }, [lastTokenId]);

  useEffect(() => {
    if (tokenId) localStorage.setItem("lastTokenId", tokenId);
  }, [tokenId]);
  const stableSetLocalStorage = useRef<(id: string) => void>(() => {});

  stableSetLocalStorage.current = (tokenId: string) => {
    if (tokenId) localStorage.setItem("lastTokenId", tokenId);
  };

  useEffect(() => {
    stableSetLocalStorage.current?.(tokenId);
  }, [tokenId]);

  const kwhValue =
    (customAmount ? parseFloat(customAmount) : 0) / ENERGY_PRICE_PER_KWH;

  const closeSlideshow = () => {
    setSlideOpen(false);
    // Restore body scrolling
    document.body.style.overflow = "auto";
  };
  // Event handlers
  const handleTokenIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");

    setTokenId(value);
  };

  const handleNextStep = () => {
    setAvatarTransitioned(true);
    setStep(2);
  };

  useEffect(() => {
    if (selectedAmounts.length > 1) {
      const b = selectedAmounts.reduce((sum, amount) => sum + amount, 0);
      setCustomAmount(String(b));
    }
  }, [selectedAmounts]);

  const handleAmountToggle = (amount: number) => {
    if (selectedAmounts.includes(amount)) {
      setSelectedAmounts(selectedAmounts.filter((a) => a !== amount));
    } else {
      setSelectedAmounts([...selectedAmounts, amount]);
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow decimals with up to 2 decimal places
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setCustomAmount(value);
    }
  };

  const handleSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      const data = encodeFunctionData({
        abi: contractConfig.abi,
        functionName: "pay",
        args: [BigInt(tokenId), BigInt(customAmount)],
      });

      sendTransaction({
        to: contractConfig.address,
        data: data,
      });
    },
    [sendTransaction, tokenId, customAmount]
  );

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    (async () => {
      await sdk.actions.ready({ disableNativeGestures: true });
    })();
  }, []);

  return (
    <div className="h-[calc(91vh-70px)] p-4 mt-[100px]">
      <meta name="fc:frame" content={`${frame}`} />
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="max-w-xl mx-auto relative">
        <div className="space-y-6">
          <div
            className={`transition-all duration-500 ${
              step === 1
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-10 absolute"
            }`}
          >
            <div className="bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 bg-white/20 rounded-2xl p-6 shadow-lg">
              <div className="w-full flex flex-col h-fit items-center">
                {tokenId ? (
                  <>
                    <M3terHead seed={tokenId} size={100} />
                    <p className="text-[13px] font-bold text-white gap-2">
                      {capitalizeWords(m3terAlias(tokenId))}
                    </p>
                  </>
                ) : (
                  <Skeleton className="bg-white/20 w-[100px] h-[100px] rounded-[10px]" />
                )}
              </div>
              <input
                type="text"
                value={tokenId}
                onChange={handleTokenIdChange}
                placeholder="Enter M3ter ID"
                className="w-full text-lg text-white bg-transparent placeholder:text-gray-200 border-b border-purple-300 focus:border-purple-600 outline-none px-0 py-2 mb-4"
              />
              {isConnected ? (
                <button
                  onClick={handleNextStep}
                  disabled={!tokenId}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  className="bg-[#9b6dff] w-full hover:opacity-80 text-white flex items-center justify-center py-3 space-x-2 rounded-lg font-semibold"
                  onClick={() => {
                    connect({ connector: connectors[0] });
                  }}
                >
                  <span>Connect</span>
                  <Wallet size={20} />
                </button>
              )}
            </div>
          </div>

          <div
            className={`transition-all duration-500 ${
              step === 2
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10 absolute"
            }`}
          >
            <div className="bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 bg-white/20 rounded-2xl p-6 shadow-lg">
              <div className="grid grid-cols-4 gap-3 mb-4">
                {PRESET_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountToggle(amount)}
                    className={`p-4 text-center rounded-lg transition-all ${
                      selectedAmounts.includes(amount)
                        ? "bg-purple-200/80 text-purple-800"
                        : "bg-white/70 hover:bg-white/90"
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className={`relative mb-4`}>
                <input
                  type="text"
                  value={customAmount}
                  inputMode={"decimal"}
                  onChange={handleCustomAmountChange}
                  placeholder="Enter amount"
                  className="w-full text-lg text-white bg-transparent placeholder:text-gray-400 outline-none px-0 py-2"
                />

                {Number(customAmount) > 0 && (
                  <span
                    className={`text-sm text-white pt-2 absolute bottom-[50%] translate-y-[50%] right-0`}
                  >
                    {kwhValue.toFixed(2)} kWh⚡
                  </span>
                )}
              </div>

              {isConnected ? (
                <button
                  onClick={handleSubmit}
                  type="button"
                  disabled={isConfirming || Number(customAmount) <= 0}
                  className="w-full py-3 rounded-lg bg-[#9b6dff] text-white hover:bg-[#8559f2] disabled:hover:bg-[#9b6dff] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isConfirming ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Pay
                      <SendHorizonal className="h-4 w-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  className="bg-[#9b6dff] w-full hover:opacity-80 text-white flex items-center justify-center py-3 space-x-2 rounded-lg font-semibold"
                  onClick={() => {
                    connect({ connector: connectors[0] });
                  }}
                >
                  <span>Connect</span>
                  <Wallet size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {slideOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeSlideshow}
            className="absolute top-6 right-6 z-50 bg-transparent border-none cursor-pointer"
            aria-label="Close slideshow"
          >
            <CircleX className={`text-white`} />
          </button>

          {/* Swiper Component */}
          {/* <div className="w-full h-full max-w-5xl max-h-screen p-4">
            <EmblaSlideshow />
          </div> */}
        </div>
      )}
    </div>
  );
}
