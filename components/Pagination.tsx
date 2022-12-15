import { propTypeEntryNumber } from "../config/types"
import Pagination from "@mui/material/Pagination"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import { useState, useEffect } from "react"

export default function PaginationButtons(props: propTypeEntryNumber) {
    const [page, setPage] = useState(1)
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
        props.onChangePage!(value)
    }

    useEffect(() => {
        setPage(1)
    }, [props.category])

    return (
        <Box
            my={2}
            display="flex"
            justifyContent="center"
        >
            <Stack spacing={2}>
                <Pagination
                    count={(props.amount! % 10 == 0) ? (props.amount!/10) : (Math.floor(props.amount! / 10) + 1)}
                    page={page}
                    onChange={handleChange}
                    showFirstButton
                    showLastButton
                    size="large"
                    color="primary"
                    style={{ textAlign: "center", color: "black", justifyContent: "center"}}
                />
            </Stack>
        </Box>
    )
}
