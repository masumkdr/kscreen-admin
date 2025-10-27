import { useEffect } from "react";
import { useNavigationType, useLocation } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../styles/nprogress.css";

NProgress.configure({ showSpinner: true, trickleSpeed: 100,
  minimum: 0.15 });

export default function RouteProgress() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Start progress bar when route begins to change
    NProgress.start();

    // Complete progress bar when new page loads
    NProgress.done();

    return () => {
      NProgress.remove();
    };
  }, [location, navigationType]);

  return null;
}
