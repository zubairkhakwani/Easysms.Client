//Material UI
import TablePagination from "@mui/material/TablePagination";

//Css
import "./Pagination.css";

export default function Paginations({
  page,
  rowsPerPage,
  count,
  handleChangePage,
  handleChangeRowsPerPage,
}) {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
}
