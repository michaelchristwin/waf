import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/config/wagmiConfig";
import "@/styles.css";
import { AppContextProvider } from "@/store/app.store";
import Navbar from "@/components/Navbar";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <>
      <AppContextProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <Navbar />
            <Outlet />
          </QueryClientProvider>
        </WagmiProvider>
      </AppContextProvider>
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
});
