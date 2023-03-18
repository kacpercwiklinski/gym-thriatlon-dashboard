import { ChangeEventHandler, FormEventHandler, useState } from 'react';

export type FormInput = {
    name: string;
    label: string,
    placeholder: string,
    value: string | number;
    type: "HTMLInputElement" | "HTMLSelectElement";
    valueType: "text" | "number";
}


type Props = {
    formInputs: FormInput[];
    onInputChange: ChangeEventHandler
    onSubmit: FormEventHandler;
}

const Form = ({ formInputs, onSubmit, onInputChange }: Props) => {

    const [editMode, setEditMode] = useState(false);

    const renderElement = (formInput: FormInput) => {
        if (formInput.type === "HTMLInputElement") {
            return <input name={formInput.name} key={formInput.name} onChange={onInputChange} type={formInput.valueType} placeholder={formInput.placeholder} value={formInput.value} className="input w-full max-w-[12rem] input-bordered" />
        } else if (formInput.type === "HTMLSelectElement") {
            // TODO: Add options input to common form element
            // return <select name={formInput.name} onChange={onInputChange} className="select w-full max-w-[10rem] input-bordered" value={formInput.value}>
            //     <option value="" disabled>Zawodnik</option>
            //     {users ? users.map(user => <option key={user.id} value={user.id}>{user.name}</option>) : null}
            // </select>
        }
    }


    return (
        <form className="flex space-x-2" onSubmit={onSubmit}>
            {formInputs.map(formInput => renderElement(formInput))}
            <button className="btn btn-outline btn-accent">{editMode ? "Edytuj" : "Dodaj"}</button>
        </form>
    )
}

export default Form