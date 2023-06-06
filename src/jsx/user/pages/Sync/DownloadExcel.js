import React from "react";
import { imgServer } from "../../../../dataConfig";
import { useSelector } from "react-redux";

function DownloadExcel(data) {
  const { Code } = useSelector((a) => a.DepartmentSettingSlice);

  const handleDownload = () => {
    fetch(`${imgServer}${data.data}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/vnd.ms-excel",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // create a temporary URL object from the blob
        const url = window.URL.createObjectURL(new Blob([blob]));

        // create a link element to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", Code + data.data.split("/")[4]);
        document.body.appendChild(link);
        link.click();

        // remove the temporary URL object from memory
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading Excel file:", error);
      });
  };

  return (
    <div className="btn btn-primary" onClick={handleDownload}>
      Download
    </div>
  );
}

export default DownloadExcel;
