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
import { FormatRemainingTime } from "../../../../helper/UtilityHelper";

//Css
import "./ActiveNumbers.css";

export default function ActiveNumbers() {
  const [activeNumbers, setActiveNumbers] = useState([]);
  const [filteredNumbers, setFilteredNumbers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

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
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getActiveNumbersData();
  }, []);

  // Tick server-provided remainingSeconds for display only (admin table).
  useEffect(() => {
    if (!activeNumbers.length) return;

    const interval = setInterval(() => {
      setActiveNumbers((prev) =>
        prev.map((order) => ({
          ...order,
          remainingSeconds: Math.max(
            0,
            (order.remainingSeconds ?? order.activationLimit * 60) - 1,
          ),
        })),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [activeNumbers.length]);

  useEffect(() => {
    if (!searchKeyword) {
      setFilteredNumbers(activeNumbers);
      return;
    }

    const keyword = searchKeyword.toLowerCase();
    setFilteredNumbers(
      activeNumbers.filter(
        (u) =>
          u.activationId?.toLowerCase().includes(keyword) ||
          u.phoneNumber?.toLowerCase().includes(keyword) ||
          u.name?.toLowerCase().includes(keyword) ||
          u.email?.toLowerCase().includes(keyword),
      ),
    );
  }, [activeNumbers, searchKeyword]);

  // Update the UI when sms code receives
  useEffect(() => {
    if (!latestSms) {
      return;
    }

    setActiveNumbers((current) =>
      current.map((number) => {
        if (number.id === latestSms.id) {
          return { ...number, otp: latestSms.code };
        }
        return number;
      }),
    );
  }, [latestSms]);

  // Update the UI when a new number gets added
  useEffect(() => {
    if (!newNumbers) {
      return;
    }
    setActiveNumbers((current) => [...newNumbers, ...current]);
  }, [newNumbers]);

  // Update the UI when a number gets removed
  useEffect(() => {
    if (!removeNumberId) {
      return;
    }
    setRemovingId(removeNumberId);

    const timer = setTimeout(() => {
      setActiveNumbers((current) =>
        current.filter((number) => number.id !== removeNumberId),
      );
      setRemovingId(null);
    }, 600);

    return () => clearTimeout(timer);
  }, [removeNumberId]);

  return (
    <div className="ph-page">
      <div className="ph-table-panel">
        <div className="ph-table-header">
          <span className="ph-table-title">Active Numbers</span>
        </div>
        {!isLoading && (
          <>
            <div className="ph-table-wrap">
              <div className="um-table-header">
                <span className="um-table-title">All Active Numbers</span>
                <input
                  className="um-search-input"
                  placeholder="🔍  Search numbers..."
                  onChange={(e) => setSearchKeyword(e.target.value)}
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
                    <th>Name</th>
                    <th>Email</th>
                    <th>Provider</th>
                    <th>Country</th>
                    <th>Purchased At</th>
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

                      <td className="ph-col-sms">
                        {FormatRemainingTime(r.remainingSeconds)}
                      </td>
                      <td className="ph-col-id">{r.name}</td>
                      <td className="ph-col-id">{r.email}</td>
                      <td className="ph-col-id">{r.provider}</td>
                      <td className="ph-col-id">{r.country}</td>
                      <td className="ph-col-sms" title={r.purchasedAt}>
                        {FormatterHelper.formatDateToLocal(r.purchasedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {isLoading && (
          <div className="ph-state-row">
            <div className="ph-spinner" />
            <span className="ph-state-text">Fetching records…</span>
          </div>
        )}

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
