import { Row, Col, Typography, Image } from 'antd';
import { useEffect, useState } from 'react';
import UploadContent from '../../components/UploadContent';
import { imgServer } from '../../dataConfig';
import { getValueFromEvent } from '../../utils/upload';
import { IMAGE_LIMIT_SIZE } from '../../constants/upload';

const { Title, Paragraph } = Typography;

function HomePage() {


    return (
        <div style={{ padding: '2rem' }}>
            <Row>
                <Col xs={24} md={12} style={{ marginBottom: '1rem' }}>
                    <Title style={{ lineHeight: 1.1, margin: 0 }} level={3}>
                        Trường THPT Hà Nội
                    </Title>
                    <Title level={5}>Thông Báo</Title>
                    <Paragraph>Tầm nhìn: Trở thành tốp 15 trường ngoài công lập uy tín của ngành giáo dục Thủ Đô.

                        Sứ mệnh: Đào tạo những thế hệ học trò là những người học sinh phát triển toàn diện về Đức, Trí, Thể, Mĩ.

                        Triết lý giáo dục: Trường THPT Hoàng Mai xây dựng phương châm giáo dục dựa trên triết lý giáo dục của Tổ chức Giáo dục, Khoa học và Văn hoá Liên Hiệp Quốc (UNESCO): “Học để biết. Học để làm. Học để khẳng định bản thân. Học để chung sống”.

                        Lịch sử hình thành: Trường THPT Hoàng Mai tiền thân là trường THPT Dân lập Nguyễn Thượng Hiền, được thành lập theo Quyết định số 1613/QĐ-UBND, ngày 25/04/1997 của Chủ tịch UBND Thành phố Hà Nội.

                        Tháng 10 năm 2017, Chủ tịch UBND thành phố Hà Nội đã ban hành Quyết định số 6982/QĐ-UBND cho phép đổi tên trường THPT Nguyễn Thượng Hiền thành trường THPT Hoàng Mai.

                        Tháng 02 năm 2018, Giám đốc Sở Giáo dục và Đào tạo thành phố Hà Nội đã ban hành Quyết định số 339/QĐ-SGDĐT cho phép trường THPT Hoàng Mai được chuyển địa điểm về số 54A2, đường Vũ Trọng Phụng, quận Thanh Xuân, Hà Nội và sáng tháng 9/2022 trường chuyển địa điểm về địa chỉ 56 Vũ Trọng Phụng, Thanh Xuân, Hà Nội</Paragraph>
                </Col>
                <Col xs={24} md={12} style={{ marginBottom: '1rem' }}>
                    <Image
                        width='100%'
                        src={`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?${1}`}
                        placeholder={
                            <Image
                                preview={false}
                                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                                width={200}
                            />
                        }
                    />
                </Col>
            </Row>
        </div>
    );
}

export default HomePage;
