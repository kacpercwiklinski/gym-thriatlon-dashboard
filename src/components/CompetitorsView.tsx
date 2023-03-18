import { api } from "~/utils/api";
import Table from "./Table";

type Props = {}

const CompetitorsView = (props: Props) => {
    const { data: users } = api.users.findAll.useQuery();

    return (
        <>
            <h2>Zawodnicy</h2>
            <Table columns={[
                { label: "Wyciskacz", key: "name" },
                { label: "Waga", key: "weight", colSpan: 2 }
            ]} data={users ? users : []} />
        </>
    )
}

export default CompetitorsView