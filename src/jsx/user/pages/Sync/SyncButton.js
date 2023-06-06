import React, { useState, useEffect } from "react";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import { getInforAPI } from "../../../../services/TemplateAPI";
function SyncButton(props) {
  const [inforApi, setInforApi] = useRefreshToken(
    getInforAPI,
    props.apiID !== 0 ? props.apiID : props.defaultApiID
  );
  if (inforApi !== false && inforApi !== null) {
    props.setHeader(inforApi.RawHeader);
    props.setdatamapping(inforApi.MappingData);
    props.setsample(inforApi.RawSampleData);
    if (inforApi.Header.length > 0 && inforApi.SampleData.length > 0) {
      props.setshow(true);
    }
  }
  return (
    <>
      {/* <LoadingModal
        show={showModal}
        onHide={() => setShowModal(false)}
        timeout={20000}
      /> */}
      {/* <button
        type="button"
        className="btn btn-primary  mt-2 text-center"
        onClick={callSyncAPI}
        disabled={props.isSubmitting}
      >
        Sync
      </button> */}
      <div className="border " style={{ minHeight: "150px" }}>
        <div style={{ overflowX: "auto" }}>
          {inforApi ? (
            <>
              <table className="table table-bordered text-center">
                <thead>
                  <tr>
                    {inforApi.Header.map((row, i) => (
                      <th key={i} scope="col">
                        {row}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody style={{ color: "black" }}>
                  <tr className="fw-normal">
                    {inforApi.Header.map((row, i) => (
                      <td key={i} className="align-middle">
                        {i}{" "}
                      </td>
                    ))}
                  </tr>
                  <tr className="fw-normal">
                    {inforApi.SampleData.map((sample, i) => (
                      <td key={i} className="align-middle">
                        {sample}{" "}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </>
          ) : inforApi === false ? (
            <>
              <div>No data</div>
            </>
          ) : (
            <div className="d-flex justify-content-center align-items-center vh-75">
              <div className="classic-1"></div>
            </div>
          )}
        </div>
        {inforApi !== false &&
          inforApi !== null &&
          inforApi.Header.length < 1 &&
          inforApi.SampleData.length < 1 ? (
          <>
            <div>No data</div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
export default SyncButton;
