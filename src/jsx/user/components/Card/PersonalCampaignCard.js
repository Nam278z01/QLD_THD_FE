const PersonalCampaignCard = () => {
  return (
    <div className="col-4 my-2">
      <div className=" py-4 align-items-center  p-2 border bg-light rounded">
        <div className="d-flex flex-row">
          <h4 className="col-10 text-primary text-weight ">
            <span className="m-2">English Score </span>
          </h4>
          <p className=" text-xs badge bg-green">Done</p>
        </div>
        <h5 className="m-2 text-blue">
          Deadline:
          <text className=" m-2 text-ellipsis text-red"> 2022/11/11 </text>
        </h5>
        <div className="m-2" style={{ minHeight: 120 }}>
          <h5 className="text-blue">Description: </h5>
          <span className=" m-2 overflow-hidden text-dark">
            {" "}
            Mỗi năm hoa phượng nở, lại thấy ông đồ già, cầm mực tàu giấy đỏ, bên
            phố đông ngườaifg ghẻ qua.sfgsdfgsdf bánh cuốn bánh giò bánh đúc xay
            da da cà na bánh đa
          </span>
        </div>
        <div>
          <button
            className="m-2 text-white border-0 bg-blue rounded"
            onClick={(e) => {}}
            hidden={false}
          >
            <text className="m-2">Submit Envidence</text>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalCampaignCard;
