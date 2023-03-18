import { type NextPage } from "next";
import Head from "next/head";
import CompetitorsView from "~/components/CompetitorsView";
import ScoresView from "~/components/ScoresView";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Trójbój siłowy</title>
        <meta name="description" content="Trójbój siłowy tabela" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="container mx-auto pt-8">
          <CompetitorsView />
          <hr />
          <ScoresView />
        </div>
      </main>
    </>
  );
};

export default Home;
