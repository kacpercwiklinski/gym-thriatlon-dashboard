import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Navbar from "~/components/Navbar";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="prose max-w-none">
      <Navbar />
      <Component {...pageProps} />
    </div>)
};

export default api.withTRPC(MyApp);
