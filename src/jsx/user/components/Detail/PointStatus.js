import React from "react";
import "../../../../scss/components/card/card.scss";
import { getLastPoint } from "../../../../services/LeaderBoardAPI";
import useRefreshToken from "../../../../Hook/useRefreshToken";
const PointStatus = ({
  userID,
  month,
  year
}) => {
 
  
  
    const [point] = useRefreshToken(
      getLastPoint,
      month,
      year,
      userID,
    );
    
  return point===null ?<></>  : (
    <> {point>0&&(<i style={{color:"green"}} class="fa-solid fa-arrow-up"></i>)}{point==0&&(<i  class="fa-solid fa-minus"></i>)}{point<0&&(<i style={{color:"red"}} class="fa-sharp fa-solid fa-arrow-down"></i>)}</>
  );
};

export default PointStatus;
