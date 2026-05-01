//React
import { useState, useEffect } from "react";

//Serives
import { getAllPhysical } from "../../../../../services/Number/NumberService";

//Toaster
import { errorToast } from "../../../../../helper/Toaster";

//Helper
import { FormatterHelper } from "../../../../../helper/FormatterHelper";

//Static
import { PhysicalNumberStatus } from "../../../../../data/Static";

//Pagination
import Paginations from "../../../../Shared/Pagination";

export function PhysicalNumbers() {
  //Data
  const [physicalNumbers, setPhysicalNumbers] = useState([]);

  //Loading
  const [isLoading, setIsLoading] = useState(false);

  //Filters
  const [filters, setFilters] = useState({
    status: "0",
    orderByCancellationCountDesc: false,
  });

  //Paginations
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  async function getPhysicalNumbersData() {
    setIsLoading(true);
    try {
      let response = await getAllPhysical({
        pageNo,
        pageSize,
        filters,
      });
      var responseMessage = response.message;
      if (response.isSuccess) {
        setPhysicalNumbers(response.data.items ?? []);
        setCount(response.data.count);
      } else {
        errorToast(responseMessage);
      }
    } catch {
      errorToast("Failed to fetch physical numbers");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getPhysicalNumbersData();
  }, [pageNo, pageSize, filters]);

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNo(0);
  };

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="ph-page">
      {/* ── FILTERS ── */}
      <div className="nh-filters-bar">
        <div className="nh-filters-left">
          <span className="nh-filters-heading">Filters</span>
          <div className="nh-filter-group">
            <label className="nh-filter-label">Status</label>
            <select
              className={`nh-filter-select`}
              value={filters.status}
              onChange={(e) => setFilter("status", e.target.value)}
            >
              {PhysicalNumberStatus.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="nh-filter-group">
            <label className="nh-filter-label">OTP</label>
            <label className={`nh-filter-checkbox`}>
              <input
                type="checkbox"
                checked={filters.orderByCancellationCountDesc}
                onChange={(e) =>
                  setFilter("orderByCancellationCountDesc", e.target.checked)
                }
              />
              Order By Cancellation Count
            </label>
          </div>
        </div>
      </div>
      {/* ── Table ── */}
      <div className="ph-table-panel">
        <div className="ph-table-header">
          <span className="ph-table-title">Physical Numbers</span>
        </div>
        {/* Table */}
        {!isLoading && (
          <>
            <div className="ph-table-wrap">
              <table className="ph-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Id</th>
                    <th>Number</th>
                    <th>Url</th>
                    <th>Token</th>
                    <th>Purchased Price</th>
                    <th>Cancelled Count</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Sold At</th>
                  </tr>
                </thead>
                <tbody>
                  {physicalNumbers.map((r, index) => (
                    <tr key={r.id}>
                      <td className="ph-col-id">{index + 1}</td>
                      <td className="ph-col-id">{r.id}</td>
                      <td className="ph-col-id">{r.number}</td>
                      <td className="ph-col-id">{r.url}</td>
                      <td className="ph-col-id">{r.token}</td>
                      <td className="ph-col-id">
                        {FormatterHelper.formatCurrency(r.purchasedPrice)}
                      </td>
                      <td className="ph-col-id">{r.canclledCount}</td>
                      <td className="ph-col-id">{r.status}</td>
                      <td className="ph-col-date">
                        {FormatterHelper.formatDateToLocal(r.createdAt)}
                      </td>

                      <td className="ph-col-date">
                        {r.soldAt
                          ? FormatterHelper.formatDateToLocal(r.soldAt)
                          : "- "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="ph-state-row">
            <div className="ph-spinner" />
            <span className="ph-state-text">Fetching records…</span>
          </div>
        )}

        {/* Empty result */}
        {!isLoading && physicalNumbers.length === 0 && (
          <div className="ph-state-row">
            <div className="ph-state-icon">⊟</div>
            <span className="ph-state-text">
              No records found for the selected filters
            </span>
          </div>
        )}
        {!isLoading && (
          <Paginations
            page={pageNo}
            rowsPerPage={pageSize}
            count={count}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
      </div>
    </div>
  );
}
