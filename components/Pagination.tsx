import { propTypeEntryNumber } from "../config/types"
import Pagination from "@mui/material/Pagination"
import Stack from "@mui/material/Stack"
import { useState } from "react"

// export default function ShowMoreLess(props: propTypeEntryNumber) {
//     //adds x entries at a time when button clicked
//     return (
//         <>
//             <div className="text-center">
//                 <button
//                     className="h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
//                     onClick={() => props.onChangeAmount(Number(props.amount) + Number(12))}
//                 >
//                     Show More
//                 </button>
//             </div>
//         </>
//     )
// }
export default function PaginationButtons(props: propTypeEntryNumber) {
    const [page, setPage] = useState(1);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value)
      props.onChangePage!(value)
    }
    return (
        <Stack spacing={2}>
            <Pagination
                count={10}
                page={page}
                onChange={handleChange}
                showFirstButton
                showLastButton
            />
        </Stack>
    )
}
