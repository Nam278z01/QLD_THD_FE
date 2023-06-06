import { useState } from "react";
import { Button } from "react-bootstrap";
import Select from "react-select";
import CustomClearIndicator from "../PluginsMenu/Select2/MultiSelect";

const TextNoRead = {
  fontWeight: "600",
};

const SkillTab = ({ data, account, userAccount }) => {
  const [skills, setSkills] = useState(
    data.Skill !== null ? data.Skill.split(", ") : []
  );
  const [certificate, setCertificate] = useState(
    data.Certificate !== null ? data.Certificate.split(", ") : []
  );
  const SkillList = skills.map((x) => ({
    value: x,
    label: x,
  }));
  const CertificateList = certificate.map((x) => ({
    value: x,
    label: x,
  }));

  return (
    <div className="pt-2">
      <div className="col-12 mb-3">
        <h6 className="fw-600">Skills:</h6>
        <div className="d-flex flex-wrap gap-2">
          {userAccount === account ? (
            <CustomClearIndicator
              options={SkillList}
              defaultValue={SkillList}
            />
          ) : skills.length === 0 ? (
            <h6>NO DATA</h6>
          ) : (
            skills.map((skill, i) => (
              <Button variant="outline-primary pe-none" key={i}>
                {skill}
              </Button>
            ))
          )}
        </div>
      </div>

      <div className="col-12">
        <h6 className="fw-600">Certificate:</h6>
        <div className="d-flex flex-wrap gap-2">
          {userAccount === account ? (
            <CustomClearIndicator
              options={CertificateList}
              defaultValue={CertificateList}
            />
          ) : certificate.length === 0 ? (
            <h6>NO DATA</h6>
          ) : (
            certificate.map((certificate, i) => (
              <Button variant="outline-primary pe-none" key={i}>
                {certificate}
              </Button>
            ))
          )}
        </div>
      </div>

      <div className="col-12">
        {userAccount === account && (
          <Button
            as="a"
            href="#"
            className="btn btn-primary mt-2"
            onClick={() => dispatch({ type: "sendMessage" })}
          >
            Update
          </Button>
        )}
      </div>
    </div>
  );
};

export default SkillTab;
