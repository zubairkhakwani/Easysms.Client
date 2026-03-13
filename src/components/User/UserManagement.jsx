//React
import { useState, useEffect, useContext } from "react";

//Toaster
import { toast, Slide } from "react-toastify";

//Context
import { AuthContext } from "../../context/AuthContext";

//Services
import { getAll, topUpBalance } from "../../services/User/UserService";

//Helper
import { FormatterHelper } from "../../helper/FormatterHelper";

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

function TopupModal({ user, onClose, onConfirm }) {
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
            className="um-btn primary"
            disabled={!amount || Number(amount) <= 0}
            onClick={() => onConfirm(user.id, Number(amount))}
          >
            💰 Add ${amount || "0"}
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
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await getAll();
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch recent numbers:", error);
      }
    };
    fetchAllUsers();
  }, []);

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

  const handleSave = (updated) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    closeModal();
  };

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
    var response = await topUpBalance(userId, amount);
    var responseMessage = response.message;
    if (response.isSuccess) {
      toast(responseMessage, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
      closeModal();
      handleOnSuccessTopup(userId, amount);
    } else {
      toast.error(responseMessage, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
    }
  };

  const stats = [
    { label: "Total Users", val: users.length },
    { label: "Active", val: users.filter((u) => u.isActive).length },
    { label: "In-Active", val: users.filter((u) => !u.isActive).length },
    {
      label: "Total Balance",
      val: FormatterHelper.formatCurrency(
        users.reduce((s, u) => s + u.balance, 0),
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

      <div className="um-stats-row">
        {stats.map((s) => (
          <div key={s.label} className="um-stat-card">
            <div className="um-stat-val">{s.val}</div>
            <div className="um-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="um-table-wrap">
        <div className="um-table-header">
          <span className="um-table-title">All Users</span>
          <input
            className="um-search-input"
            placeholder="🔍  Search users..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <table className="um-table">
          <thead>
            <tr>
              {["User", "Role", "Balance", "Status", "Joined", "Actions"].map(
                (h) => (
                  <th key={h} className="um-th">
                    {h}
                  </th>
                ),
              )}
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
                  <span className={`um-role-badge ${user.role.toLowerCase()}`}>
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
                <td className="um-td um-joined">{user.joinedAt}</td>
                <td className="um-td">
                  <ActionDropdown user={user} onAction={openModal} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="um-empty">No users found.</div>
        )}
      </div>
      {modal?.type === "topup" && (
        <TopupModal
          user={modal.user}
          onClose={closeModal}
          onConfirm={handleTopup}
        />
      )}
    </div>
  );
}
