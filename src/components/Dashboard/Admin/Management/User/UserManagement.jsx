//React
import { useState, useEffect, useContext, useCallback } from "react";

//Portal
import { DropdownPortal } from "../../../../../portal/DropDownPortal";

//Context
import { AuthContext } from "../../../../../context/AuthContext";

//Services
import { getAll, topUpBalance, commissionWithdraw } from "../../../../../services/User/UserService";

//Toaster
import { successTaost, errorToast } from "../../../../../helper/Toaster";

//Helper
import { FormatterHelper } from "../../../../../helper/FormatterHelper";
import { BalanceCorrectionReasons } from "../../../../../data/Static";

//Components
import { AdminPage } from "../../../../Helper/AdminPage/AdminPage";
import { AdminStats } from "../../../../Helper/AdminStats/AdminStats";

//Paginations
import Paginations from "../../../../Shared/Pagination";
import SearchableSelect from "../../../../Shared/SearchableSelect/SearchableSelect";

//Css
import "./UserManagement.css";

function ActionDropdown({ user, onAction }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const items = [
    { key: "topup", label: "Top Up Balance", icon: "💰", color: "cyan" },
    { key: "commissionWithdraw", label: "Commission Withdraw", icon: "📤", color: "orange" },
  ];

  return (
    <DropdownPortal
      open={open}
      onClose={close}
      trigger={
        <button className="um-action-btn" onClick={() => setOpen((v) => !v)}>
          Actions <span className="um-action-down-arrow">▾</span>
        </button>
      }
    >
      <div className="um-dropdown">
        {items.map((item) => (
          <div
            key={item.key}
            className={`um-drop-item ${item.color}`}
            onClick={() => {
              close();
              onAction(item.key, user);
            }}
          >
            <span>{item.icon}</span> {item.label}
          </div>
        ))}
      </div>
    </DropdownPortal>
  );
}

function TopupModal({ user, isTopUp, onClose, onConfirm }) {
  const [amount, setAmount] = useState("");
  const [correctionReason, setCorrectionReason] = useState("");
  const [correctionReasonText, setCorrectionReasonText] = useState("");
  const presets = [5, 10, 25, 50];

  const isNegative = Number(amount) < 0;

  const isConfirmDisabled =
    isTopUp ||
    !amount ||
    Number(amount) === 0 ||
    (isNegative && !correctionReason) ||
    (isNegative && correctionReasonText.trim().length < 15);

  const handleConfirm = () => {
    onConfirm(
      user.id,
      Number(amount),
      isNegative ? correctionReason : null,
      isNegative ? correctionReasonText : null,
    );
  };

  return (
    <div className="um-overlay">
      <div className="um-modal" onClick={(e) => e.stopPropagation()}>
        <button className="um-close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="um-modal-title">Top Up Balance</div>
        <div className="um-modal-sub">{user.name}</div>

        <div className="um-topup-display">
          <div>
            <div className="um-topup-balance-label">Current Balance</div>
            <div className="um-topup-balance-val">
              {FormatterHelper.formatCurrency(user.balance)}
            </div>
          </div>
          <span style={{ fontSize: "1.5rem" }}>💳</span>
        </div>

        <label className="um-label">Quick Select</label>
        <div className="um-preset-row">
          {presets.map((p) => (
            <button
              key={p}
              className={`um-preset-btn ${amount === String(p) ? "selected" : ""}`}
              onClick={() => setAmount(String(p))}
            >
              ${p}
            </button>
          ))}
        </div>

        <label className="um-label">
          Custom Amount ($) <span className="required">*</span>
        </label>
        <input
          className="um-input"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* Negative entry fields — only shown when amount is negative */}
        {isNegative && (
          <>
            <label className="um-label">
              Correction Reason <span className="required">*</span>
            </label>
            <SearchableSelect
              className="um-input"
              value={correctionReason}
              onChange={setCorrectionReason}
              placeholder="Select a reason"
              options={BalanceCorrectionReasons.map((reason) => ({
                value: reason.value,
                label: reason.displayName,
              }))}
            />

            <label className="um-label">
              Explain in your own words:{" "}
              <span className="um-char-hint">
                {correctionReasonText.trim().length} / 15 min{" "}
                <span className="required">*</span>
              </span>
            </label>
            <textarea
              className="um-input"
              placeholder="Describe why this deduction is being made..."
              value={correctionReasonText}
              onChange={(e) => setCorrectionReasonText(e.target.value)}
              rows={3}
            />
            {correctionReasonText.trim().length > 0 &&
              correctionReasonText.trim().length < 15 && (
                <span className="error-msg">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle
                      cx="6"
                      cy="6"
                      r="5.25"
                      stroke="#ff5f7e"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M6 3.5v3"
                      stroke="#ff5f7e"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle cx="6" cy="8.25" r="0.6" fill="#ff5f7e" />
                  </svg>
                  Please enter at least 15 characters.
                </span>
              )}
          </>
        )}

        {amount && Number(amount) !== 0 && (
          <p className="um-new-balance">
            New balance will be{" "}
            <span>
              {FormatterHelper.formatCurrency(user.balance + Number(amount))}
            </span>
          </p>
        )}

        <div className="um-modal-actions">
          <button className="um-btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`um-btn ${!isTopUp ? "primary" : ""}`}
            disabled={isConfirmDisabled}
            onClick={handleConfirm}
          >
            {isTopUp ? (
              <div className="ph-spinner" />
            ) : (
              <span>
                {isNegative
                  ? `⚠️ Deduct $${Math.abs(Number(amount)) || "0"}`
                  : `💰 Add $${amount || "0"}`}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function CommissionWithdrawModal({ user, isSubmitting, onClose, onConfirm }) {
  const [amount, setAmount] = useState("");
  const [reasonText, setReasonText] = useState("");

  const isConfirmDisabled =
    isSubmitting ||
    !amount ||
    Number(amount) <= 0 ||
    reasonText.trim().length < 15;

  const handleConfirm = () => {
    onConfirm(user.id, Number(amount), reasonText.trim());
  };

  return (
    <div className="um-overlay">
      <div className="um-modal" onClick={(e) => e.stopPropagation()}>
        <button className="um-close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="um-modal-title">Commission Withdraw</div>
        <div className="um-modal-sub">{user.name}</div>

        <div className="um-topup-display">
          <div>
            <div className="um-topup-balance-label">Commission Balance</div>
            <div className="um-topup-balance-val">
              {FormatterHelper.formatCurrency(user.commissionBalance ?? 0)}
            </div>
          </div>
          <span style={{ fontSize: "1.5rem" }}>📤</span>
        </div>

        <label className="um-label">
          Amount ($) <span className="required">*</span>
        </label>
        <input
          className="um-input"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label className="um-label">
          Reason <span className="required">*</span>
          <span className="um-char-hint">
            {reasonText.trim().length} / 15 min
          </span>
        </label>
        <textarea
          className="um-input"
          placeholder="Describe why this commission withdrawal is being processed..."
          value={reasonText}
          onChange={(e) => setReasonText(e.target.value)}
          rows={3}
        />

        {amount && Number(amount) > 0 && (
          <p className="um-new-balance">
            New commission balance will be{" "}
            <span>
              {FormatterHelper.formatCurrency(
                Math.max(0, (user.commissionBalance ?? 0) - Number(amount)),
              )}
            </span>
          </p>
        )}

        <div className="um-modal-actions">
          <button className="um-btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`um-btn ${!isSubmitting ? "primary" : ""}`}
            disabled={isConfirmDisabled}
            onClick={handleConfirm}
          >
            {isSubmitting ? (
              <div className="ph-spinner" />
            ) : (
              <span>📤 Withdraw ${amount || "0"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserManagement() {
  const { currentUser, balanceCredit } = useContext(AuthContext);

  //Api Data
  const [users, setUsers] = useState([]);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalActive: 0,
    totalInActive: 0,
    totalBalance: 0,
  });

  //Modal
  const [modal, setModal] = useState(null);
  const [isTopup, setIsTopUp] = useState(false);
  const [isCommissionWithdrawing, setIsCommissionWithdrawing] = useState(false);

  //Loading
  const [isLoading, setIsLoading] = useState(false);

  //Paginations
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  //Filter
  const [keyword, setKeyword] = useState("");
  const [hasSourceFilter, setHasSourceFilter] = useState(false);
  const [hasReferrerFilter, setHasReferrerFilter] = useState(false);

  const hasActiveFilters = hasSourceFilter || hasReferrerFilter;

  useEffect(() => {
    const fetchAllUsers = async () => {
      setIsLoading(true);
      try {
        const res = await getAll({
          pageNo,
          pageSize,
          keyword,
          hasSource: hasSourceFilter,
          hasReferrer: hasReferrerFilter,
        });
        if (!res.isSuccess) {
          errorToast(res.message || "Failed to fetch users");
          return;
        }
        const responseData = res.data;
        setUsers(responseData?.users?.items ?? []);
        setCount(responseData?.users?.count ?? 0);
        setSystemStats({
          totalUsers: responseData?.totalUsers ?? 0,
          totalActive: responseData?.totalActive ?? 0,
          totalInActive: responseData?.totalInActive ?? 0,
          totalBalance: responseData?.totalBalance ?? 0,
        });
      } catch {
        errorToast("Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllUsers();
  }, [pageNo, pageSize, keyword, hasSourceFilter, hasReferrerFilter]);

  function clearFilters() {
    setHasSourceFilter(false);
    setHasReferrerFilter(false);
    setPageNo(0);
  }

  function toggleSourceFilter() {
    setHasSourceFilter((v) => !v);
    setPageNo(0);
  }

  function toggleReferrerFilter() {
    setHasReferrerFilter((v) => !v);
    setPageNo(0);
  }

  function handleSearch(keyword) {
    setKeyword(keyword);
  }

  const openModal = (type, user) => setModal({ type, user });
  const closeModal = () => setModal(null);

  function handleOnSuccessTopup(userId, amount) {
    //Update the balance in the users table whose balance was credited
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        user.balance = user.balance + amount;
      }
      return user;
    });
    setUsers(updatedUsers);

    //If the credited user is the currently logged-in user, update the balance shown in the navbar
    if (currentUser.id === userId) {
      balanceCredit(amount);
    }
  }

  function handleOnSuccessCommissionWithdraw(userId, withdrawnAmount) {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              commissionBalance: Math.max(
                0,
                (user.commissionBalance ?? 0) - withdrawnAmount,
              ),
            }
          : user,
      ),
    );
  }

  const handleCommissionWithdraw = async (userId, amount, reasonText) => {
    setIsCommissionWithdrawing(true);
    try {
      const response = await commissionWithdraw(userId, { amount, reasonText });
      if (response.isSuccess) {
        successTaost(response.message);
        closeModal();
        handleOnSuccessCommissionWithdraw(userId, amount);
      } else {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to process commission withdrawal.");
    } finally {
      setIsCommissionWithdrawing(false);
    }
  };

  const handleTopup = async (
    userId,
    amount,
    correctionReason,
    correctionReasonText,
  ) => {
    setIsTopUp(true);
    let payLoad = {
      userId,
      amount,
      correctionReason,
      correctionReasonText,
    };
    try {
      var response = await topUpBalance(payLoad);

      var responseMessage = response.message;
      if (response.isSuccess) {
        successTaost(responseMessage);
        closeModal();
        handleOnSuccessTopup(userId, amount);
      } else {
        errorToast(responseMessage);
      }
    } catch {
      errorToast("Failed to perform operation.");
    } finally {
      setIsTopUp(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNo(0);
  };

  const systemOverviewStats = [
    { label: "Total Users", val: systemStats.totalUsers },

    { label: "Active Users", val: systemStats.totalActive },

    { label: "Inactive Users", val: systemStats.totalInActive },

    {
      label: "Total Balance",
      val: FormatterHelper.formatCurrency(systemStats.totalBalance),
    },
  ];

  const currentPageStats = [
    { label: "Users on Page", val: users.length },

    {
      label: "Active on Page",
      val: users.filter((u) => u.isActive).length,
    },

    {
      label: "Inactive on Page",
      val: users.filter((u) => !u.isActive).length,
    },

    {
      label: "Page Balance",
      val: FormatterHelper.formatCurrency(
        users.reduce((s, u) => s + u.balance, 0),
      ),
    },
  ];

  return (
    <AdminPage>
      {/* SYSTEM OVERVIEW */}
      <AdminStats
        title="System Overview"
        titleIcon="📊"
        subTitle="Overall platform statistics"
        stats={systemOverviewStats}
      />

      {/* CURRENT PAGE */}
      <AdminStats
        title="Current Page"
        titleIcon="📄"
        subTitle="Filtered / paginated results"
        stats={currentPageStats}
      />

      <div className="um-table-wrap">
        <div className="um-table-header">
          <div className="um-table-header-left">
            <span className="um-table-title">All Users</span>
            <div className="um-filter-bar">
              <span className="um-filter-label">Filters</span>
              <div className="um-filter-group" role="group" aria-label="User filters">
                <button
                  type="button"
                  className={`um-filter-chip ${hasSourceFilter ? "um-filter-chip--active" : ""}`}
                  onClick={toggleSourceFilter}
                  aria-pressed={hasSourceFilter}
                >
                  <i className="fa-solid fa-tag um-filter-chip-icon" aria-hidden />
                  <span>With source</span>
                  <i
                    className={`fa-solid fa-check um-filter-chip-check ${hasSourceFilter ? "" : "um-filter-chip-check--hidden"}`}
                    aria-hidden
                  />
                </button>
                <button
                  type="button"
                  className={`um-filter-chip ${hasReferrerFilter ? "um-filter-chip--active" : ""}`}
                  onClick={toggleReferrerFilter}
                  aria-pressed={hasReferrerFilter}
                >
                  <i className="fa-solid fa-user-group um-filter-chip-icon" aria-hidden />
                  <span>Referred</span>
                  <i
                    className={`fa-solid fa-check um-filter-chip-check ${hasReferrerFilter ? "" : "um-filter-chip-check--hidden"}`}
                    aria-hidden
                  />
                </button>
              </div>
              <span
                className={`um-filter-clear-wrap ${hasActiveFilters ? "" : "um-filter-clear-wrap--hidden"}`}
                aria-hidden={!hasActiveFilters}
              >
                <span className="um-filter-divider" aria-hidden />
                <button
                  type="button"
                  className="um-filter-clear"
                  onClick={clearFilters}
                  tabIndex={hasActiveFilters ? 0 : -1}
                >
                  ✕ Clear filters
                </button>
              </span>
            </div>
          </div>
          <input
            className="adm-search-input"
            placeholder="🔍  Search by name, email, phone, or source..."
            onChange={(e) => {
              setKeyword(e.target.value);
              setPageNo(0);
            }}
          />
        </div>
        {!isLoading && (
          <table className="um-table">
            <thead>
              <tr>
                {[
                  "#",
                  "User",
                  "Phone Number",
                  "Referred by",
                  "Source",
                  "Role",
                  "Balance",
                  "Commission",
                  "Status",
                  "Joined",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className={`um-th${h === "#" ? " um-col-id" : ""}${h === "Joined" ? " um-col-joined" : ""}${h === "Actions" ? " um-col-actions" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className="um-tr">
                  <td className="um-td um-col-id">{index + 1}</td>
                  <td className="um-td">
                    <div className="um-user-cell">
                      <div className="um-avatar">{user.avatar}</div>
                      <div>
                        <div className="um-user-name">{user.name}</div>
                        <div className="um-user-email">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="um-td">
                    <span className="um-user-name">
                      {user.phoneNumber
                        ? FormatterHelper.formatPhoneNumber(user.phoneNumber)
                        : "-"}
                    </span>
                  </td>
                  <td className="um-td">
                    {user.referredByName ? (
                      <div className="um-user-cell">
                        <div className="um-avatar">{user.referredByAvatar}</div>
                        <div>
                          <div className="um-user-name">{user.referredByName}</div>
                          <div className="um-user-email">{user.referredByEmail}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="um-user-name">-</span>
                    )}
                  </td>
                  <td className="um-td">
                    <span className="um-user-name">
                      {user.source ? user.source : "-"}
                    </span>
                  </td>
                  <td className="um-td">
                    <span
                      className={`um-role-badge ${user.role.toLowerCase()}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="um-td">
                    <span className="um-balance">
                      {FormatterHelper.formatCurrency(user.balance)}
                    </span>
                  </td>
                  <td className="um-td">
                    <span className="um-balance">
                      {FormatterHelper.formatCurrency(user.commissionBalance ?? 0)}
                    </span>
                  </td>
                  <td className="um-td">
                    <span
                      className={`um-status-badge ${user.isActive ? "active" : "inactive"}`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="um-td um-joined um-col-joined">
                    {FormatterHelper.formatDateToLocal(user.joinedAt)}
                  </td>
                  <td className="um-td um-col-actions">
                    <ActionDropdown user={user} onAction={openModal} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="ph-state-row">
            <div className="ph-spinner" />
            <span className="ph-state-text">Fetching records…</span>
          </div>
        )}

        {/* Empty result */}
        {!isLoading && users.length === 0 && (
          <div className="ph-state-row">
            <div className="ph-state-icon">⊟</div>
            <span className="ph-state-text">No users found</span>
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

      {modal?.type === "topup" && (
        <TopupModal
          user={modal.user}
          isTopUp={isTopup}
          onClose={closeModal}
          onConfirm={handleTopup}
        />
      )}

      {modal?.type === "commissionWithdraw" && (
        <CommissionWithdrawModal
          user={modal.user}
          isSubmitting={isCommissionWithdrawing}
          onClose={closeModal}
          onConfirm={handleCommissionWithdraw}
        />
      )}
    </AdminPage>
  );
}
