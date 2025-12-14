import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("tsdg_cookie_notice");
    if (!seen) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem("tsdg_cookie_notice", "acknowledged");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="mx-auto max-w-4xl rounded-xl border bg-white shadow-sm p-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="text-slate-700">
          This site uses cookies and anonymised analytics to understand usage and
          improve content.{" "}
          <Link
            to="/privacy"
            className="underline underline-offset-2"
          >
            Privacy notice
          </Link>
          .
        </div>

        <button
          onClick={dismiss}
          className="rounded-lg px-4 py-2 text-sm font-medium"
          style={{
            background: "rgb(var(--primary))",
            color: "rgb(var(--primary-fg))",
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
