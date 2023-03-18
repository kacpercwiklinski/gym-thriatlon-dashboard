import { User, UserScore } from "@prisma/client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { api } from "~/utils/api";

type Props = {
    userScores: (UserScore & { user: User })[];
    refetch: any
}

const UserScoreForm = ({ userScores, refetch }: Props) => {
    const { data: users } = api.users.findAll.useQuery();

    const findOneUserMutation = api.users.findOne.useMutation();
    const addScoreMutation = api.userScoresRouter.create.useMutation({ onSuccess: () => refetch() });
    const updateScoreMutation = api.userScoresRouter.update.useMutation({ onSuccess: () => refetch() });

    const [scoreFormData, setScoreFormData] = useState({
        competitorId: "",
        squat: "",
        deadlift: "",
        benchpress: "",
    });

    const [editMode, setEditMode] = useState(false);

    const handleFormSubmission = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { competitorId, squat, deadlift, benchpress } = scoreFormData;

        const competitor = await findOneUserMutation.mutateAsync({ id: competitorId });
        if (!competitor) return;

        if (editMode) {
            const userScore = userScores.find(userScore => userScore.user.id === competitor.id);
            if (!userScore) return;

            await updateScoreMutation.mutateAsync({
                scoreId: userScore?.id,
                competitorWeight: competitor.weight,
                squatScore: parseFloat(squat),
                deadliftScore: parseFloat(deadlift),
                benchPressScore: parseFloat(benchpress)
            }).then(() => {
                console.log("Wynik dodany.")
            })
        } else {
            await addScoreMutation.mutateAsync({
                competitorId: competitorId,
                competitorWeight: competitor.weight,
                squatScore: parseFloat(squat),
                deadliftScore: parseFloat(deadlift),
                benchPressScore: parseFloat(benchpress)
            }).then(() => {
                console.log("Wynik dodany.")
            })
        }

        setScoreFormData({
            competitorId: "",
            squat: "",
            deadlift: "",
            benchpress: "",
        })
    }

    useEffect(() => {
        const currentUserScore = userScores.find(score => score.user.id === scoreFormData.competitorId);
        if (!currentUserScore) {
            setEditMode(false);
            setScoreFormData({
                competitorId: "",
                squat: "",
                deadlift: "",
                benchpress: "",
            })
        }
    }, [userScores])

    const scoreFormOnChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "competitorId") {
            const userScore = userScores.find(userScore => userScore.user.id === e.target.value);
            if (userScore) {
                setEditMode(true)
                setScoreFormData({
                    competitorId: e.target.value,
                    squat: userScore.squatScore.toString(),
                    deadlift: userScore.deadliftScore.toString(),
                    benchpress: userScore.benchPressScore.toString()
                })
            } else {
                setEditMode(false)
                setScoreFormData({
                    competitorId: e.target.value,
                    squat: "",
                    deadlift: "",
                    benchpress: "",
                })
            }
        } else {
            setScoreFormData({ ...scoreFormData, [e.target.name]: e.target.value });
        }
    };

    return (
        <form className="flex space-x-2" onSubmit={handleFormSubmission}>
            <select name="competitorId" onChange={scoreFormOnChange} className="select w-full max-w-[10rem] input-bordered" value={scoreFormData.competitorId}>
                <option value="" disabled>Zawodnik</option>
                {users ? users.map(user => <option key={user.id} value={user.id}>{user.name}</option>) : null}
            </select>
            <input name="squat" onChange={scoreFormOnChange} type="number" placeholder="Przysiad" value={scoreFormData.squat} className="input w-full max-w-[12rem] input-bordered" />
            <input name="deadlift" onChange={scoreFormOnChange} type="number" placeholder="Martwy" value={scoreFormData.deadlift} className="input w-full max-w-[12rem] input-bordered" />
            <input name="benchpress" onChange={scoreFormOnChange} type="number" placeholder="Płaska" value={scoreFormData.benchpress} className="input w-full max-w-[12rem] input-bordered" />
            <button className="btn btn-outline btn-accent">{editMode ? "Edytuj" : "Dodaj"}</button>
        </form>
    )
}

export default UserScoreForm