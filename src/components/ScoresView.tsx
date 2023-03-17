import { User, UserScore } from '@prisma/client';
import _ from 'lodash';
import { ChangeEvent, FormEvent, useState } from 'react';
import { api } from '~/utils/api';


type Props = {}

interface SortColumnType extends UserScore {
  user: User;
}

const ScoresView = (props: Props) => {
  const { data: users } = api.users.findAll.useQuery();

  const { data: userScores, refetch } = api.userScoresRouter.findAll.useQuery();
  const findOneUserMutation = api.users.findOne.useMutation();
  const addScoreMutation = api.userScoresRouter.create.useMutation({ onSuccess: () => refetch() });
  const deleteScoreMutation = api.userScoresRouter.delete.useMutation({ onSuccess: () => refetch() });


  const [sortColumn, setSortColumn] = useState<keyof SortColumnType | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [scoreFormData, setScoreFormData] = useState({
    competitorId: "",
    squat: "",
    deadlift: "",
    benchpress: "",
  });

  // const clearScoresMutation = api.userScoresRouter.deleteAll.useMutation({ onSuccess: () => refetch() }); // TODO: Remove

  const sortedData = userScores ? [...userScores].sort((a, b) => {
    if (sortColumn == null) {
      return 0;
    }

    const aValue = _.get(a, sortColumn);
    const bValue = _.get(b, sortColumn);

    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1;
    } else if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1;
    } else {
      return 0;
    }
  }) : [];

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

  const handleColumnClick = (key: keyof SortColumnType | any) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(key);
      setSortDirection("asc");
    }
  }

  const renderSpan = (key: keyof SortColumnType | any) => {
    if (sortColumn === key) {
      return <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
    }
  }

  const handleScoreDelete = async (id: string) => {
    return await deleteScoreMutation.mutateAsync({ scoreId: id });
  }

  return (
    <>
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
            <th ></th>
          </tr>
          <tr className="text-center [&>*]:p-0.5 [&>*]:text-sm">
            <th className="text-center cursor-pointer" onClick={() => handleColumnClick("user.name")}>Wyciskacz {renderSpan("user.name")}</th>
            <th className="text-center cursor-pointer" onClick={() => handleColumnClick("user.weight")}>Waga {renderSpan("user.weight")}</th>
            <th className="text-center cursor-pointer" onClick={() => handleColumnClick("squatScore")}>KG {renderSpan("squatScore")}</th>
            <th className="text-center cursor-pointer" onClick={() => handleColumnClick("squatWilks")}>Wilks {renderSpan("squatWilks")}</th>
            <th className="text-center cursor-pointer" onClick={() => handleColumnClick("deadliftScore")}>KG {renderSpan("deadliftScore")}</th>
            <th className="text-center cursor-pointer" onClick={() => handleColumnClick("deadliftWilks")}>Wilks {renderSpan("deadliftWilks")}</th>
            <th className="text-center cursor-pointer" onClick={() => handleColumnClick("benchPressScore")}>KG {renderSpan("benchPressScore")}</th>
            <th className="text-center cursor-pointer" onClick={() => handleColumnClick("benchPressWilks")}>Wilks {renderSpan("benchPressWilks")}</th>
            <th className="text-center cursor-pointer" onClick={() => handleColumnClick("totalScore")}>KG {renderSpan("totalScore")}</th>
            <th className="text-center cursor-pointer" onClick={() => handleColumnClick("totalWilks")}>Wilks {renderSpan("totalWilks")}</th>
            <th className="text-center" >Akcje</th>
          </tr>
        </thead>
        <tbody>

          {
            sortedData.map(userScore => {
              return <tr key={userScore.id} className="hover text-center transition-all">
                <td className="border border-t-0 border-b-0 border-l-0 border-r-2 border-r-accent/40">
                  {userScore.user.name}
                </td>
                <td className="border border-t-0 border-b-0 border-l-0 border-r-2 border-r-accent/40">{userScore.user.weight}</td>
                <td className="border border-t-0 border-b-0 border-l-0 border-r-1 border-r-accent/40">{userScore.squatScore} kg</td>
                <td className="border border-t-0 border-b-0 border-l-0 border-r-2 border-r-accent/40">{userScore.squatWilks.toFixed(2)} pts</td>
                <td className="border border-t-0 border-b-0 border-l-0 border-r-1 border-r-accent/40">{userScore.deadliftScore} kg</td>
                <td className="border border-t-0 border-b-0 border-l-0 border-r-2 border-r-accent/40">{userScore.deadliftWilks.toFixed(2)} pts</td>
                <td className="border border-t-0 border-b-0 border-l-0 border-r-1 border-r-accent/40">{userScore.benchPressScore} kg</td>
                <td className="border border-t-0 border-b-0 border-l-0 border-r-2 border-r-accent/40">{userScore.benchPressWilks.toFixed(2)} pts</td>
                <td className="border border-t-0 border-b-0 border-l-0 border-r-1 border-r-accent/40">{userScore.totalScore.toFixed(2)} kg</td>
                <td className="border border-t-0 border-b-0 border-l-0 border-r-1 border-r-accent/40">{userScore.totalWilks.toFixed(2)} pts</td>
                <td className="border border-t-0 border-b-0 border-l-0">
                  <div className="flex justify-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="m-1 w-6 h-6 text-neutral hover:text-info cursor-pointer transition-colors">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    <svg onClick={() => handleScoreDelete(userScore.id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="m-1 w-6 h-6 text-neutral hover:text-error cursor-pointer transition-colors">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </div>
                </td>
              </tr>
            })}

        </tbody>
      </table>
    </>
  )
}

export default ScoresView