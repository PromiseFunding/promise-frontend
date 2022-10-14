import { propTypeEntryNumber } from "../config/types"

export default function ShowMoreLess(props: propTypeEntryNumber) {
    //adds 4 entries at a time when button clicked
    return (
        <>
            <div className="text-center">
                <button
                    className="h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
                    onClick={() => props.onChangeAmount(Number(props.amount) + Number(12))}
                >
                    Show More
                </button>
            </div>
        </>
    )
}
