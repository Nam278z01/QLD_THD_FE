import { getAllCampaign,getAllActiveCampaign } from "../../../../../services/CampaignAPI";
import useQuery from "../../../../../Hook/useQuery";
import useRefreshToken from "../../../../../Hook/useRefreshToken";
import useReplaceURL from "../../../../../Hook/useReplaceURL";
import Loading from "../../../../sharedPage/pages/Loading";
import { Card } from "react-bootstrap";
import CampaignCard from "../../../components/Card/CampaignCard";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Link, useLocation, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomPagination from "../../../components/Shared/CustomPagination";
import CardTitleWithSearch from "../../../components/Card/CardTitleWithSearch";
import { Tab, Nav } from "react-bootstrap";

const AllCampaign = ({ AllCampaign, setRefresh }) => {
    const query = useQuery();
  const searchQuery = query.get("search");
  const rowQuery = query.get("row") || 9;
  const pageQuery = query.get("page") || 1;
  const { role } = useSelector((state) => state.UserSlice);
  const { URLchange } = useReplaceURL("/campaign-list/");
  const { url } = useRouteMatch();

  const path = useLocation().pathname;

  function pageChange(page) {
    URLchange(page, rowQuery, searchQuery);
  }
  function rowChange(row) {
    URLchange(1, row, searchQuery);
  }
  function searchHandleUtil(search) {
    URLchange(1, rowQuery, "", search);
  }

    return AllCampaign === null ? (
    <Loading />
  ) : (
    <>
         <div className="d-flex flex-column">
      
      <div
        className=" d-flex flex-column border px-4 "
        style={{ minHeight: 600 }}
      >
        <div className=" row py-2">
          {AllCampaign.campaignListData.map((i) =>
            
              <CampaignCard className="" datas={i} key={i.ID} />
            
          )}
        </div>
      </div>
      
    </div>
    </>
  );
};

export default AllCampaign;
