import { User, UserScore } from '@prisma/client';
import _ from 'lodash';
import { useState } from 'react';
import { api } from '~/utils/api';
import UserScoreForm from './UserScoreForm';


type Props = {}

interface SortColumnType extends UserScore {
  user: User;
}

const ScoresView = (props: Props) => {
  const { data: userScores, refetch } = api.userScoresRouter.findAll.useQuery();
  const deleteScoreMutation = api.userScoresRouter.delete.useMutation({ onSuccess: () => refetch() });

  const [sortColumn, setSortColumn] = useState<keyof SortColumnType | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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
    await deleteScoreMutation.mutateAsync({ scoreId: id });

  }

  return (
    <>
      <h1>Wyniki</h1>
      {userScores && <UserScoreForm userScores={userScores} refetch={refetch} />}
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
                <td className="border-0">
                  <div className="flex justify-center space-x-2">
                    <svg onClick={() => handleScoreDelete(userScore.id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="m-1 w-6 h-6 text-accent hover:text-error cursor-pointer transition-colors">
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