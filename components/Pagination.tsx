import { propTypeEntryNumber } from "../config/types"
import Pagination from "@mui/material/Pagination"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import { useState } from "react"

export default function PaginationButtons(props: propTypeEntryNumber) {
    const [page, setPage] = useState(1)
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
        props.onChangePage!(value)
    }
    return (
        <Box
            my={2}
            display="flex"
            justifyContent="center"
        >
            <Stack spacing={2}>
                <Pagination
                    count={Math.floor(props.amount! / 8) + 1}
                    page={page}
                    onChange={handleChange}
                    showFirstButton
                    showLastButton
                    size="large"
                    color="primary"
                    style={{ textAlign: "center", color: "white", justifyContent: "center"}}
                />
            </Stack>
        </Box>
    )
}
