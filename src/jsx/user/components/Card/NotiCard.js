const NotiCard = ({ data, newNoti }) => {
  const CreDate = new Date(data.CreatedDate);
  // const Now = new Date('20 November 2019 14:48').getMonth();
  // console.log(CreDate);

  return (
    <div className={newNoti?"p-2 border m-2 text-success":"p-2 border m-2"} style={newNoti?{ backgroundColor: "rgba(0,0,0,0.1)" }:{}}>
      <div className="row">
        <span className="col-7 d-flex justify-content-start">
          {data.Content} {data.Sender}
        </span>
        <span className="col-5 text-red d-flex justify-content-end">
          {CreDate.toUTCString().substring(17, 22)} -{" "}
          {CreDate.toUTCString().substring(5, 17)}
        </span>
      </div>
    </div>
  );
};

export default NotiCard;
