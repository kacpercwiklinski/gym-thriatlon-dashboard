import { type NextPage } from "next";
import Head from "next/head";
import ScoresView from "~/components/ScoresView";
import Table from "~/components/Table";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: users } = api.users.findAll.useQuery();


  return (
    <>
      <Head>
        <title>Trójbój siłowy</title>
        <meta name="description" content="Trójbój siłowy tabela" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="container mx-auto">
          <h2>Zawodnicy</h2>
          <Table columns={[
            { label: "Wyciskacz", key: "name" },
            { label: "Waga", key: "weight", colSpan: 2 }
          ]} data={users ? users : []} />
          <hr />
          <ScoresView />

        </div>
      </main>
    </>
  );
};

export default Home;
