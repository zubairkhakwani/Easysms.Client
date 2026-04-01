//React
import { useEffect, useState, useContext } from "react";

//Context
import { SmsContext } from "../../../../context/SmsContext";
import { NumberContext } from "../../../../context/NumberContext";

//Services
import { getActiveNumbers } from "../../../../services/Number/NumberService";

//Toaster
import { errorToast } from "../../../../helper/Toaster";

//Helper
import { FormatterHelper } from "../../../../helper/FormatterHelper";

//Css
import "./ActiveNumbers.css";

export default function ActiveNumbers() {
  //State
  const [activeNumbers, setActiveNumbers] = useState([]);
  const [filteredNumbers, setFilteredNumbers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [now, setNow] = useState(Date.now());

  //Context
  const { latestSms } = useContext(SmsContext);
  const { newNumbers, removeNumberId } = useContext(NumberContext);

  async function getActiveNumbersData() {
    setIsLoading(true);
    try {
      let response = await getActiveNumbers();
      var responseMessage = response.message;
      if (!response.isSuccess) {
        errorToast(responseMessage);
      }

      setActiveNumbers(response.data);
      setFilteredNumbers(response.data);
    } finally {
      setIsLoading(false);
    }
  }

  function getRemainingTime(order) {
    if (!order.startTime || !order.activationLimit) return "Invalid";

    const startTime = new Date(order.startTime).getTime();
    if (isNaN(startTime)) return "Invalid date";

    const expiryTime = startTime + order.activationLimit * 60 * 1000;
    const remaining = expiryTime - Date.now();

    if (remaining <= 0) return "Expired";

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getActiveNumbersData();
  }, []);

  // Update the UI when sms code receives
  useEffect(() => {
    if (!latestSms) {
      return;
    }

    const updateNumbers = (numbers) =>
      numbers.map((number) => {
        if (number.id === latestSms.id) {
          return { ...number, otp: latestSms.code };
        }
        return number;
      });

    setActiveNumbers((current) => updateNumbers(current));
    setFilteredNumbers((current) => updateNumbers(current));
  }, [latestSms]);

  // Update the UI when a new number gets added
  useEffect(() => {
    if (!newNumbers) {
      return;
    }

    setActiveNumbers((current) => [...newNumbers, ...current]);
    setFilteredNumbers((current) => [...newNumbers, ...current]);
  }, [newNumbers]);

  // Update the UI when a number gets removed
  useEffect(() => {
    if (!removeNumberId) {
      return;
    }

    setRemovingId(removeNumberId);

    const timer = setTimeout(() => {
      const filterNumbers = (numbers) =>
        numbers.filter((number) => number.id !== removeNumberId);

      setActiveNumbers((current) => filterNumbers(current));

      setFilteredNumbers((current) => filterNumbers(current));

      setRemovingId(null);
    }, 600);

    return () => clearTimeout(timer);
  }, [removeNumberId]);

  function handleSearch(keyword) {
    let filteredUsers = activeNumbers.filter(
      (u) =>
        u.activationId.toLowerCase().includes(keyword.toLowerCase()) ||
        u.phoneNumber.toLowerCase().includes(keyword.toLowerCase()) ||
        u.name.toLowerCase().includes(keyword.toLowerCase()) ||
        u.email.toLowerCase().includes(keyword.toLowerCase()),
    );
    setFilteredNumbers(filteredUsers);
  }

  return (
    <div className="ph-page">
      {/* ── Table ── */}
      <div className="ph-table-panel">
        <div className="ph-table-header">
          <span className="ph-table-title">Active Numbers</span>
        </div>
        {/* Table */}
        {!isLoading && (
          <>
            <div className="ph-table-wrap">
              <div className="um-table-header">
                <span className="um-table-title">All Active Numbers</span>
                <input
                  className="um-search-input"
                  placeholder="🔍  Search numbers..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <table className="ph-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Activation Id</th>
                    <th>Phone Number</th>
                    <th>Otp</th>
                    <th>Remaining Time</th>
                    <th>Purchased At</th>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNumbers.map((r, index) => (
                    <tr
                      key={r.phoneNumber}
                      className={removingId === r.id ? "row-removing" : ""}
                    >
                      <td className="ph-col-id">{index + 1}</td>
                      <td className="ph-col-id">{r.activationId}</td>
                      <td className="ph-col-phone">{r.phoneNumber}</td>
                      <td className="ph-col-sms" title={r.otp}>
                        {r.otp ?? "-"}
                      </td>

                      <td className="ph-col-sms">{getRemainingTime(r)}</td>
                      <td className="ph-col-sms" title={r.otp}>
                        {FormatterHelper.formatDateToLocal(r.purchasedAt)}
                      </td>
                      <td className="ph-col-id">{r.name}</td>
                      <td className="ph-col-id">{r.email}</td>
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
        {!isLoading && activeNumbers.length === 0 && (
          <div className="ph-state-row">
            <div className="ph-state-icon">⊟</div>
            <span className="ph-state-text">
              No records found for the selected filters
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
