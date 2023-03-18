import { ChangeEvent, ChangeEventHandler, FormEventHandler, useState } from 'react';
import { api } from '~/utils/api';
import Form, { FormInput } from './Form';

type Props = {
    refetch: () => void;
}

const CompetitorsForm = ({ refetch }: Props) => {
    const addUserMutation = api.users.create.useMutation({ onSuccess: () => refetch() });
    const [competitorsFormData, setCompetitorsFormData] = useState({
        name: "",
        weight: ""
    });

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        console.log("onSubmit");
        await addUserMutation.mutateAsync({
            name: competitorsFormData.name,
            weight: parseFloat(competitorsFormData.weight)
        }).then(() => {
            console.log("User added.");
        })

        setCompetitorsFormData({
            name: "",
            weight: ""
        })
    }

    const handleInputChange: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCompetitorsFormData({ ...competitorsFormData, [e.target.name]: e.target.value });
    }

    const competitorsFormInput: FormInput[] = [
        {
            name: "name",
            label: "Wyciskacz",
            type: "HTMLInputElement",
            placeholder: "Wyciskacz",
            value: competitorsFormData.name,
            valueType: "text"
        },
        {
            name: "weight",
            label: "Waga",
            type: "HTMLInputElement",
            placeholder: "Waga",
            value: competitorsFormData.weight,
            valueType: "number"
        }
    ]

    return (
        <Form formInputs={competitorsFormInput} onSubmit={handleSubmit} onInputChange={handleInputChange} />
    )
}

export default CompetitorsForm