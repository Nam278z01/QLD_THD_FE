import { Formik } from "formik";
import { Button, Col, Form, Row } from "react-bootstrap";
import * as Yup from "yup";
import { createScheduleAwardBadge, getScheduleBadge, updateScheduleAwardBadge } from "../../../../services/BadgeAPI";
import { useContext } from "react";
import { GetTokenContext } from "../../../../context/GetTokenContext";
import useRefreshToken from "../../../../Hook/useRefreshToken";
import Loading from "../../../sharedPage/pages/Loading";
import { useEffect } from "react";
import { useState } from "react";

const dateChoice = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];

function BadgeSchedule({ badgeId, setRefresh, setShow }) {

    const { getToken } = useContext(GetTokenContext);
    const [scheduleData] = useRefreshToken(getScheduleBadge, badgeId);
    const [data, setData] = useState({});
    const ruleSchema = Yup.object().shape({
        Name: Yup.string().min(3).required("Please enter a name")
    });

    useEffect(() => {
        setData(scheduleData);
    }, [scheduleData]);

    const initialValues = {
        Name: data?.Name || "",
        BadgeID: badgeId || 0,
        Description: data?.Description || "",
        StartTime: data?.StartTime || 1,
        Auto: data?.Auto == 1 || false,
    }

    const success = () => {
        setRefresh(new Date());
        setShow(false);
    };

    const createOrUpdateSchedule = (values) => {
        var body = values;
        if (values.Auto === true) {
            body.Auto = 1; // 1 is auto every mouth            
        } else {
            body.Auto = 2;; // 2 is auto once
        }
        body.BadgeID = badgeId;
        if (data?.ID) {
            getToken(updateScheduleAwardBadge, "Update success", success, false, body, badgeId);
        } else {
            getToken(createScheduleAwardBadge, "Create success", success, false, body);
        }
    };

    const changeStatusSchedule = (status) => {
        getToken(updateScheduleAwardBadge, "Update success", success, false, {Status: status}, badgeId);
    }

    return (
        data !== null && <>
            <Formik
                initialValues={initialValues}
                validationSchema={ruleSchema}
                validator={() => ({})}
                onSubmit={(values, { setSubmitting }) => {
                    createOrUpdateSchedule(values);
                    setSubmitting(false);
                }}
            >
                {({
                    values,
                    errors,
                    handleChange,
                    handleBlur,
                    isSubmitting,
                    handleSubmit,
                    resetForm,
                    touched,
                }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Row className="p-2">
                            <Form.Group as={Col} sm="4" className="mb-3" controlId="StartTime">
                                <Form.Label>
                                    Date
                                </Form.Label>
                                <Form.Select name="StartTime" value={values.StartTime} aria-label="Selecte date" onChange={handleChange}>
                                    {dateChoice.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} sm="6" className="mb-3">
                                <Form.Label>
                                    Auto every month
                                </Form.Label>
                                <Form.Check
                                    style={{ fontSize: '28px' }}
                                    type="switch"
                                    id="Auto"
                                    name="Auto"
                                    value={values.Auto}
                                    checked={values.Auto}
                                    onChange={handleChange}
                                    isValid={touched.Auto && !errors.Auto}
                                />
                            </Form.Group>
                            <Form.Group as={Col} sm="12" className="mb-3 me-1" controlId="Name">
                                <Form.Label>
                                    Name
                                </Form.Label>
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    placeholder="please enter schedule name"
                                    name="Name"
                                    value={values.Name}
                                    onChange={handleChange}
                                    isInvalid={!!errors.Name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.Name}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} sm="12" className="mb-3" controlId="Description">
                                <Form.Label>
                                    Description
                                </Form.Label>
                                <Form.Control
                                    size="sm"
                                    as="textarea"
                                    rows={3}
                                    placeholder="please enter schedule description"
                                    name="Description"
                                    value={values.Description}
                                    onChange={handleChange}
                                    isValid={touched.Description && !errors.Description}
                                />
                            </Form.Group>
                        </Row>
                        {data?.ID ? (
                            <>
                            <Button variant="warning" className="float-end ms-1" type="submit">
                                update
                            </Button>
                            {data?.Status === 1 ?
                                (
                                    <Button onClick={() => changeStatusSchedule(2)} variant="danger" className="float-end">
                                        Stop
                                    </Button>
                                ) : (
                                    <Button onClick={() => changeStatusSchedule(1)} variant="success" className="float-end">
                                        Start
                                    </Button>
                                )}
                        </>
                        ) : (
                            <Button variant="success" className="float-end" type="submit">
                                create
                            </Button>
                        )}
                    </Form>
                )}
            </Formik>
        </>
    );
}

export default BadgeSchedule;