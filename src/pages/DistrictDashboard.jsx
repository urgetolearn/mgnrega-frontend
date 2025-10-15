import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPerformance } from "../api/performanceApi";
import { useTranslation } from "react-i18next";

const DistrictDashboard = () => {
  const { state, district, year } = useParams();
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchPerformance(state, district, year);

        if (!res || res.length === 0) {
          setError(
            t("no_data_found") || "No data found for this district and year."
          );
          return;
        }

        const aggregatedData = res.reduce(
          (acc, cur) => {
            acc.Approved_Labour_Budget += cur.Approved_Labour_Budget || 0;
            acc.Average_Wage_rate_per_day_per_person +=
              cur.Average_Wage_rate_per_day_per_person || 0;
            acc.Number_of_Completed_Works += cur.Number_of_Completed_Works || 0;
            acc.Number_of_Ongoing_Works += cur.Number_of_Ongoing_Works || 0;
            acc.Material_and_skilled_Wages +=
              cur.Material_and_skilled_Wages || 0;
            acc.Average_days_of_employment_provided_per_Household +=
              cur.Average_days_of_employment_provided_per_Household || 0;
            return acc;
          },
          {
            Approved_Labour_Budget: 0,
            Average_Wage_rate_per_day_per_person: 0,
            Number_of_Completed_Works: 0,
            Number_of_Ongoing_Works: 0,
            Material_and_skilled_Wages: 0,
            Average_days_of_employment_provided_per_Household: 0,
          }
        );

        aggregatedData.Average_Wage_rate_per_day_per_person = (
          aggregatedData.Average_Wage_rate_per_day_per_person / res.length
        ).toFixed(2);

        aggregatedData.Average_days_of_employment_provided_per_Household = (
          aggregatedData.Average_days_of_employment_provided_per_Household /
          res.length
        ).toFixed(2);

        setData(aggregatedData);
      } catch (err) {
        console.error(err);
        setError(t("error_fetching_data") || "Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [state, district, year, t]);

  if (loading)
    return (
      <div className="text-center mt-20 text-lg">
        {t("loading_data") || "Loading data..."}
      </div>
    );
  if (error)
    return <div className="text-center mt-20 text-red-600">{error}</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
        {t("dashboard_title")} — {district}, {state} ({year})
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold mb-4">
          {t("performance_summary") || "Performance Summary"}
        </h2>
        <div className="grid grid-cols-2 gap-6 text-gray-800">
          <div>
            <strong>{t("approved_labour_budget")}:</strong> ₹
            {data.Approved_Labour_Budget}
          </div>
          <div>
            <strong>{t("average_wage_rate")}:</strong> ₹
            {data.Average_Wage_rate_per_day_per_person}
          </div>
          <div>
            <strong>{t("ongoing_works")}:</strong>{" "}
            {data.Number_of_Ongoing_Works}
          </div>
          <div>
            <strong>{t("completed_works")}:</strong>{" "}
            {data.Number_of_Completed_Works}
          </div>
          <div>
            <strong>{t("material_and_skilled_wages")}:</strong> ₹
            {data.Material_and_skilled_Wages}
          </div>
          <div>
            <strong>{t("average_days_of_employment")}:</strong>{" "}
            {data.Average_days_of_employment_provided_per_Household}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistrictDashboard;
