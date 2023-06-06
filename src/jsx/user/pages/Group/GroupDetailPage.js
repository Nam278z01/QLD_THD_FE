

const GroupDetailPage = () =>{
    
  const detailDes = "Đơn vị được xây dựng trên vjshfdkvjsdfkvskdfjvbksjdbvkjsbdvjbskdfjvbskdfbvksjdbfvksfk.sdvsd.fvs.fdv.s.fdvs.fdv.s.dfvsdfsfdsdfgsd fj"
  return (
    <div className="col">
      <div className="row">
        <h1 className="col-10 text-blue">Group Detail</h1>
        <div className="col-2">
          <button className="mx-4 py-2 px-4 bg-primary text-white border-0 rounded">Save</button>
        </div>
      </div>
      <div className="col border">
        <div className="row m-2">
          <div className="col col-6" style={{minHeight: 100}}>
            <span className="text-primary" >Group Name:</span>
            <div className="col-11 d-flex flex-row rounded border p-2">
            <input type="text" className="col-12 border-0" defaultValue={"All Member FLT"}></input>            
            </div>
          </div>          
        </div>

        <div className="row m-2">
          <div className="col col-6 ">
            <span className="text-primary">Member:</span>
            <div className="row rounded border col-11 p-4 mx-1" style={{minHeight: 250}}>
              <div className="col-3">
                <div className="bg-primary d-inline text-white rounded p-2 mx-2">dfgsdfgsf</div>
              </div>
              <div className="col-3">
                <div className="bg-primary d-inline text-white rounded p-2 mx-2">groupitem</div>
              </div>
              <div className="col-3">
                <div className="bg-primary d-inline text-white rounded p-2 mx-2">fgsdfgs</div>
              </div>
            </div>
          </div>
          <div className="col-6 col">          
            <div className="d-flex flex-column my-2" >
              <span className="text-primary" >Short Description:</span>
              <textarea type="text" className="col-11 d-flex flex-row rounded border p-2" style={{minHeight: 80}} defaultValue={"Đơn vị FLT"}>
              </textarea>
            </div>
            <div className="d-flex flex-column my-2" >
              <span className="text-primary" >Detail Description:</span>
                <textarea type="text" className="col-11 d-flex flex-row rounded border p-2" style={{minHeight: 130}} defaultValue={detailDes}>
                  
                </textarea>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )};
  export default GroupDetailPage