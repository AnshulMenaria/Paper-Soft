import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./APIBASEURL";

const RemarkNotifier = () => {
  const [latestRemarkTimestamp, setLatestRemarkTimestamp] = useState(new Date()); // Track latest remark timestamp
  const [notifiedRemarkIds, setNotifiedRemarkIds] = useState(new Set());

  useEffect(() => {
    // Check if Notifications are supported
    if (!("Notification" in window)) {
      console.error("This browser does not support notifications.");
      return;
    }

    // Request permission to send notifications
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Function to fetch all remarks
    const fetchRemarks = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await axios.get(
          `${API_BASE_URL}/remark`, // Endpoint to fetch all remarks
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Get the latest remark timestamp
        const currentRemarks = response.data;
        const latestRemark = currentRemarks.reduce((latest, remark) => {
          const remarkDate = new Date(remark.createdAt); // Assuming 'createdAt' is the timestamp field
          return remarkDate > latest ? remarkDate : latest;
        }, new Date(0)); // Initialize with the earliest date

        // Filter remarks added since the last check
        const newRemarks = currentRemarks.filter(
          remark => new Date(remark.createdAt) > latestRemarkTimestamp && remark.designation === "Head Clerk"
        );

        // Notify for each new remark
        const newHeadClerkRemarks = newRemarks.filter(
          remark => !notifiedRemarkIds.has(remark._id)
        );

        if (newHeadClerkRemarks.length > 0) {
          setNotifiedRemarkIds(prevIds => new Set([...prevIds, ...newHeadClerkRemarks.map(r => r._id)]));
          newHeadClerkRemarks.forEach(() => sendNotification()); // Notify for each new remark
        }

        // Update latest remark timestamp
        setLatestRemarkTimestamp(latestRemark);

      } catch (error) {
        console.error("Error fetching remarks:", error.response?.data || error.message);
      }
    };

    // Function to send a notification
    const sendNotification = () => {
      if (Notification.permission === "granted") {
        new Notification("Head Clerk Remark Added", {
          body: "A new remark has been added by the Head Clerk.",
          icon: "/path-to-your-icon.png", // optional
        });
      }
    };

    // Fetch remarks initially
    fetchRemarks();

    // Set interval to check for new remarks every 30 seconds (adjust as needed)
    const intervalId = setInterval(fetchRemarks, 30000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [latestRemarkTimestamp, notifiedRemarkIds]);

  return null; // No UI is rendered for this component
};

export default RemarkNotifier;
