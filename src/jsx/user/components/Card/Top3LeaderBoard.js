import LeaderCard from "./LeaderCard";
import LeaderCard34 from "./LeaderCardTop34";

export function Top3LeaderBoard(props) {
  const { dataYear, className, setRefresh } = props;
  const lengthmem = dataYear.filter((member) => member.ID);

  return (
    <div className={className}>
      <div className="d-none d-lg-block">
        <div className="row justify-content-center">
          {lengthmem.length <= 6 ? (
            <>
              {dataYear.map((data, i) => (
                <div
                  key={i}
                  className={`col-2 ${
                    i === 0
                      ? "order-3"
                      : i === 1
                      ? " order-4"
                      : i === 2
                      ? " order-2"
                      : i === 3
                      ? " order-5"
                      : i === 4
                      ? "order-1"
                      : "order-5"
                  }`}
                >
                  <LeaderCard
                    rank={i + 1}
                    data={data}
                    setRefresh={setRefresh}
                  />
                </div>
              ))}
            </>
          ) : (
            <>
              {dataYear.slice(0, 3).map((data, i) => (
                <>
                  <div
                    key={i}
                    className={`col-2 ${
                      i === 0
                        ? "order-5"
                        : i === 1
                        ? " order-4"
                        : i === 2
                        ? " order-5"
                        : "order-5"
                    }`}
                  >
                    <LeaderCard rank={i + 1} data={data} />
                  </div>
                </>
              ))}
            </>
          )}
        </div>
        <div>
          {" "}
          <div className="d-none d-lg-block">
            <div className="row justify-content-center">
              <>
                {lengthmem.length > 6 &&
                  dataYear.slice(3, lengthmem.length).map((data, i) => (
                    <div
                      key={i}
                      className={`col-2 ${
                        i === 0
                          ? "order-1"
                          : i === 1
                          ? " order-2"
                          : i === 2
                          ? " order-3"
                          : i === 3
                          ? " order-4"
                          : i === 4
                          ? "order-5"
                          : "order-5"
                      }`}
                    >
                      <LeaderCard rank={4 + i} data={data} />
                    </div>
                  ))}
              </>
            </div>
          </div>
        </div>
      </div>
      <div className="d-lg-none">
        <div className="row justify-content-center">
          {dataYear.map((data, i) => (
            <div className="col-12 mb-4" key={i}>
              <LeaderCard34 rank={i + 1} data={data} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
