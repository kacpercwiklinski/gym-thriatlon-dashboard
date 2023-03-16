import { type NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { api } from "~/utils/api";
import wilksMale from "~/business/wilks";
import Table from "~/components/Table";

const Home: NextPage = () => {
  const { data: users } = api.users.findAll.useQuery();
  const { data: userScores, refetch } = api.userScoresRouter.findAll.useQuery();
  const findOneUserMutation = api.users.findOne.useMutation();
  const addScoreMutation = api.userScoresRouter.create.useMutation({ onSuccess: () => refetch() });

  const [scoreFormData, setScoreFormData] = useState({
    competitorId: "",
    squat: "",
    deadlift: "",
    benchpress: "",
  });

  // const clearScoresMutation = api.userScoresRouter.deleteAll.useMutation({ onSuccess: () => refetch() }); // TODO: Remove

  const addScore = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { competitorId, squat, deadlift, benchpress } = scoreFormData;

    const competitor = await findOneUserMutation.mutateAsync({ id: competitorId });

    if (!competitor) return;

    await addScoreMutation.mutateAsync({
      competitorId: competitorId,
      competitorWeight: competitor.weight,
      squatScore: parseFloat(squat),
      deadliftScore: parseFloat(deadlift),
      benchPressScore: parseFloat(benchpress)
    }).then(() => {
      console.log("Wynik dodany.")
    })

    setScoreFormData({
      competitorId: "",
      squat: "",
      deadlift: "",
      benchpress: "",
    })
  }

  const scoreFormOnChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
    setScoreFormData({ ...scoreFormData, [e.target.name]: e.target.value });
  };

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
          <h2>Nowy wynik</h2>
          <form className="flex space-x-2" onSubmit={addScore}>
            <select name="competitorId" onChange={scoreFormOnChange} className="select w-full max-w-[10rem] input-bordered" value={scoreFormData.competitorId}>
              <option value="" disabled>Zawodnik</option>
              {users ? users.map(user => <option key={user.id} value={user.id}>{user.name}</option>) : null}
            </select>
            <input name="squat" onChange={scoreFormOnChange} type="number" placeholder="Przysiad" value={scoreFormData.squat} className="input w-full max-w-[12rem] input-bordered" />
            <input name="deadlift" onChange={scoreFormOnChange} type="number" placeholder="Martwy" value={scoreFormData.deadlift} className="input w-full max-w-[12rem] input-bordered" />
            <input name="benchpress" onChange={scoreFormOnChange} type="number" placeholder="Płaska" value={scoreFormData.benchpress} className="input w-full max-w-[12rem] input-bordered" />
            <button className="btn btn-outline btn-accent">Dodaj</button>
          </form>
          <h2>Wyniki</h2>
          <table className="table max-w-8xl w-full table-zebra table-normal">
            <thead>
              <tr className="text-center [&>*]:p-3 [&>*]:text-md">
              <th></th>
              <th></th>
              <th colSpan={2}>Przysiad</th>
              <th colSpan={2}>Martwy</th>
              <th colSpan={2}>Płaska</th>
              <th colSpan={2}>Total</th>
              </tr>
              <tr className="text-center [&>*]:p-0.5 [&>*]:text-sm">
                <th className="text-center">Wyciskacz</th>
                <th className="text-center">Waga</th>
                <th className="text-center">KG</th>
                <th className="text-center">Wilks</th>
                <th className="text-center">KG</th>
                <th className="text-center">Wilks</th>
                <th className="text-center">KG</th>
                <th className="text-center">Wilks</th>
                <th className="text-center">KG</th>
                <th className="text-center">Wilks</th>
              </tr>
            </thead>
            <tbody>
              {userScores ?
                userScores.map(userScore => {
                  const summaryWeight = userScore.squatScore + userScore.deadliftScore + userScore.benchPressScore;
                  const summaryWilks = wilksMale(userScore.user.weight, summaryWeight).toFixed(2);

                  return <tr key={userScore.id} className="hover text-center">
                    <td className="border border-t-0 border-b-0 border-l-0 border-r-2 border-r-accent/40">{userScore.user.name}</td>
                    <td className="border border-t-0 border-b-0 border-l-0 border-r-2 border-r-accent/40">{userScore.user.weight}</td>
                    <td className="border border-t-0 border-b-0 border-l-0 border-r-1 border-r-accent/40">{userScore.squatScore} kg</td>
                    <td className="border border-t-0 border-b-0 border-l-0 border-r-2 border-r-accent/40">{userScore.squatWilks.toFixed(2)} pts</td>
                    <td className="border border-t-0 border-b-0 border-l-0 border-r-1 border-r-accent/40">{userScore.deadliftScore} kg</td>
                    <td className="border border-t-0 border-b-0 border-l-0 border-r-2 border-r-accent/40">{userScore.deadliftWilks.toFixed(2)} pts</td>
                    <td className="border border-t-0 border-b-0 border-l-0 border-r-1 border-r-accent/40">{userScore.benchPressScore} kg</td>
                    <td className="border border-t-0 border-b-0 border-l-0 border-r-2 border-r-accent/40">{userScore.benchPressWilks.toFixed(2)} pts</td>
                    <td className="border border-t-0 border-b-0 border-l-0 border-r-1 border-r-accent/40">{summaryWeight} kg</td>
                    <td className="border border-t-0 border-b-0 border-l-0">{summaryWilks} pts</td>
                  </tr>
                }
                )
                : null}

            </tbody>
          </table>

        </div>
      </main>
    </>
  );
};

export default Home;
