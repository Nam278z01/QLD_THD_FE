import CustomPagination from "../../Shared/CustomPagination";
import CardTitleWithSearch from "../../Card/CardTitleWithSearch";
import CampaignCard from "./CampaignCard";

const CampaignList = ({
  totalPage,
  datas,
  page,
  pageChange,
  searchHandle,
  rowChange,
}) => {
  return (
    <div className="card ">
      <CardTitleWithSearch
        title="Campaign List"
        searchHandle={searchHandle}
      />

      <div className="card-body">
        <div className="row">
          {datas.map((data, i) => (
            <CampaignCard key={i} data={data} />
          ))}
        </div>

        <CustomPagination
          page={page}
          totalPage={totalPage}
          pageChange={pageChange}
          rowChange={rowChange}
          className="mb-4"
          pageOnly={true}
          rowEvent={true}
        />
      </div>
    </div>
  );
};

export default CampaignList;
