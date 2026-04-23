//React
import { useState, useEffect, useContext } from "react";

//Toaster
import { successTaost, errorToast } from "../../../../../helper/Toaster";

//Context
import { AuthContext } from "../../../../../context/AuthContext";

//Services
import { getAll, topUpBalance } from "../../../../../services/User/UserService";

//Helper
import { FormatterHelper } from "../../../../../helper/FormatterHelper";

import Paginations from "../../../../Shared/Pagination";

//Css
import "./UserManagement.css";

function ActionDropdown({ user, onAction }) {
  const [open, setOpen] = useState(false);

  const items = [
    { key: "topup", label: "Top Up Balance", icon: "💰", color: "cyan" },
  ];

  return (
    <div className="um-dropdown-wrap">
      <button className="um-action-btn" onClick={() => setOpen((v) => !v)}>
        Actions <span style={{ opacity: 0.5 }}>▾</span>
      </button>
      {open && (
        <div className="um-dropdown">
          {items.map((item) => (
            <div
              key={item.key}
              className={`um-drop-item ${item.color}`}
              onClick={() => {
                setOpen(false);
                onAction(item.key, user);
              }}
            >
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TopupModal({ user, isTopUp, onClose, onConfirm }) {
  const [amount, setAmount] = useState("");
  const presets = [5, 10, 25, 50];

  return (
    <div className="um-overlay" onClick={onClose}>
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

        <label className="um-label">Custom Amount ($)</label>
        <input
          className="um-input"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {amount && Number(amount) > 0 && (
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
            disabled={isTopUp || !amount || Number(amount) <= 0}
            onClick={() => onConfirm(user.id, Number(amount))}
          >
            {isTopUp ? (
              <div className="ph-spinner" />
            ) : (
              <span>💰 Add ${amount || "0"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserManagement() {
  const { currentUser, balanceCredit } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalActive: 0,
    totalInActive: 0,
    totalBalance: 0,
  });
  const [modal, setModal] = useState(null);
  const [isTopup, setIsTopUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchAllUsers = async () => {
      setIsLoading(true);
      try {
        const res = await getAll({ pageNo, pageSize });
        let responseData = res.data;
        setUsers(responseData.users.items ?? []);
        setFilteredUsers(responseData.users.items ?? []);
        setCount(responseData.users.count ?? 0);
        setSystemStats({
          totalUsers: responseData.totalUsers,
          totalActive: responseData.totalActive,
          totalInActive: responseData.totalInActive,
          totalBalance: responseData.totalBalance,
        });
      } catch {
        errorToast("Failed to fetch recent numbers");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllUsers();
  }, [pageNo, pageSize]);

  function handleSearch(keyword) {
    let filteredUsers = users.filter(
      (u) =>
        u.name.toLowerCase().includes(keyword.toLowerCase()) ||
        u.email.toLowerCase().includes(keyword.toLowerCase()),
    );
    setFilteredUsers(filteredUsers);
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

  const handleTopup = async (userId, amount) => {
    setIsTopUp(true);

    var response = await topUpBalance(userId, amount);
    setIsTopUp(false);
    var responseMessage = response.message;
    if (response.isSuccess) {
      successTaost(responseMessage);
      closeModal();
      handleOnSuccessTopup(userId, amount);
    } else {
      errorToast(responseMessage);
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
    { label: "Users on Page", val: filteredUsers.length },

    {
      label: "Active on Page",
      val: filteredUsers.filter((u) => u.isActive).length,
    },

    {
      label: "Inactive on Page",
      val: filteredUsers.filter((u) => !u.isActive).length,
    },

    {
      label: "Page Balance",
      val: FormatterHelper.formatCurrency(
        filteredUsers.reduce((s, u) => s + u.balance, 0),
      ),
    },
  ];

  return (
    <div className="um-page">
      <div className="um-header">
        <div>
          <div className="um-page-title">User Management</div>
          <div className="um-page-sub">
            Manage accounts, balances, and permissions
          </div>
        </div>
      </div>

      {/* SYSTEM OVERVIEW */}

      <div className="um-stats-section">
        <div className="um-section-header">
          <div className="um-section-title">📊 System Overview</div>

          <div className="um-section-sub">Overall platform statistics</div>
        </div>

        <div className="um-stats-row">
          {systemOverviewStats.map((s) => (
            <div key={s.label} className="um-stat-card system">
              <div className="um-stat-val">{s.val}</div>

              <div className="um-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CURRENT PAGE */}

      <div className="um-stats-section">
        <div className="um-section-header">
          <div className="um-section-title">📄 Current Page</div>

          <div className="um-section-sub">Filtered / paginated results</div>
        </div>

        <div className="um-stats-row">
          {currentPageStats.map((s) => (
            <div key={s.label} className="um-stat-card page">
              <div className="um-stat-val">{s.val}</div>

              <div className="um-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="um-table-wrap">
        <div className="um-table-header">
          <span className="um-table-title">All Users</span>
          <input
            className="adm-search-input"
            placeholder="🔍  Search users..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        {!isLoading && (
          <table className="um-table">
            <thead>
              <tr>
                {[
                  "User",
                  "Phone Number",
                  "Role",
                  "Balance",
                  "Status",
                  "Joined",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="um-th">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="um-tr">
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
                    <span
                      className={`um-status-badge ${user.isActive ? "active" : "inactive"}`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="um-td um-joined">
                    {FormatterHelper.formatDateToLocal(user.joinedAt)}
                  </td>
                  <td className="um-td">
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
        {!isLoading && filteredUsers.length === 0 && (
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
    </div>
  );
}
