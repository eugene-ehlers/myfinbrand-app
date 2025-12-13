import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const MEASUREMENT_ID = "G-FY3G2BQGLZ";

export default function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    // Ensure GA loaded
    if (typeof window.gtag !== "function") return;

    window.gtag("config", MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
    });
  }, [location]);

  return null;
}
