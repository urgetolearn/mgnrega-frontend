import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSlider from "../components/Heroslider";
import emblem from "../assets/emblem.webp";
import statesData from "../statesDistricts.json";
import { useTranslation } from "react-i18next";

const years = [
  "2018-2019",
  "2019-2020",
  "2020-2021",
  "2021-2022",
  "2022-2023",
  "2023-2024",
  "2024-2025",
  "2025-2026",
];

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  const [selectedState, setSelectedState] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  useEffect(() => {
    if (selectedState) {
      const stateObj = statesData[selectedState];
      if (!stateObj) return;
      const newDistricts = Object.keys(stateObj.districts);
      setDistricts(newDistricts);
      setSelectedDistrict((prev) => (newDistricts.includes(prev) ? prev : ""));
      setSelectedYear("");
    }
  }, [selectedState]);

  const handleLocationFetch = () => {
    setGeoLoading(true);
    setGeoError("");

    if (!navigator.geolocation) {
      setGeoError(t("geolocation_not_supported"));
      setGeoLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();

          const state = data.principalSubdivision || "";
          const district =
            data.locality ||
            data.city ||
            data.localityInfo?.administrative?.find(
              (a) => a.description === "district"
            )?.name ||
            "";

          if (!state) {
            setGeoError(t("unable_detect_state"));
            return;
          }

          const matchedState = Object.keys(statesData).find(
            (s) => s.toLowerCase() === state.toLowerCase()
          );

          if (matchedState) {
            setSelectedState(matchedState);

            const districtList = Object.keys(
              statesData[matchedState].districts
            );
            const matchedDistrict = districtList.find(
              (d) => d.toLowerCase() === district.toLowerCase()
            );
            setSelectedDistrict(matchedDistrict || districtList[0]);
          } else {
            setGeoError(t("state_not_available"));
          }
        } catch (err) {
          console.error("Error during reverse geocoding:", err);
          setGeoError(t("failed_fetch_location"));
        } finally {
          setGeoLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setGeoError(t("permission_denied_location"));
        setGeoLoading(false);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedState && selectedDistrict && selectedYear) {
      navigate(
        `/district/${selectedState}/${selectedDistrict}/${selectedYear}`
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex justify-end p-4 items-center relative">
        <select
          value={i18n.language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="border-2 border-green-500 rounded-2xl p-4 text-2xl font-bold bg-white shadow-lg">
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="kn">ಕನ್ನಡ</option>
        </select>
      </div>

      <div className="relative">
        <div className="flex justify-center mt-4">
          <img src={emblem} alt="Government Emblem" className="h-16 md:h-24" />
        </div>
        <HeroSlider />
      </div>

      <div className="flex flex-col items-center justify-center flex-grow px-4 py-16">
        <div className="bg-white border border-green-200 shadow-2xl rounded-3xl p-10 w-full max-w-lg transition hover:scale-[1.01]">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-4">
            {t("dashboard_title")}
          </h2>
          <p className="text-gray-700 text-center mb-8 text-lg">
            {t("dashboard_description")}
          </p>

          <div className="text-center mb-6">
            <button
              onClick={handleLocationFetch}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md transition"
              disabled={geoLoading}>
              {geoLoading ? t("detecting_location") : t("use_current_location")}
            </button>
            {geoError && (
              <p className="text-red-600 text-sm mt-2">{geoError}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-800 text-lg mb-2">
                {t("select_state")}
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-3 border-2 border-green-400 rounded-md focus:ring-2 focus:ring-green-500 outline-none text-lg transition">
                <option value="">-- {t("choose_state")} --</option>
                {Object.keys(statesData).map((state) => (
                  <option key={state} value={state}>
                    {i18n.language === "en"
                      ? state
                      : statesData[state][i18n.language] || state}
                  </option>
                ))}
              </select>
            </div>

            {districts.length > 0 && (
              <div>
                <label className="block text-gray-800 text-lg mb-2">
                  {t("select_district")}
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full p-3 border-2 border-green-400 rounded-md focus:ring-2 focus:ring-green-500 outline-none text-lg transition">
                  <option value="">-- {t("choose_district")} --</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {i18n.language === "en"
                        ? district
                        : statesData[selectedState].districts[district][
                            i18n.language
                          ] || district}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedDistrict && (
              <div>
                <label className="block text-gray-800 text-lg mb-2">
                  {t("select_year")}
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full p-3 border-2 border-green-400 rounded-md focus:ring-2 focus:ring-green-500 outline-none text-lg transition">
                  <option value="">-- {t("choose_year")} --</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedState || !selectedDistrict || !selectedYear}
              className={`w-full py-3 rounded-lg text-white font-semibold text-lg transition-all duration-300 ${
                selectedState && selectedDistrict && selectedYear
                  ? "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
                  : "bg-gray-400 cursor-not-allowed"
              }`}>
              {t("view_performance")}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-8">
            {t("data_source")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
