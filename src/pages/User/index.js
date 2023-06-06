import { Layout } from 'antd';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import FooterContent from '../../components/Footer';
import NavBar from '../../components/NavBar';
import { routes } from '../../constants/routes';
import { GetTokenV2ContextProvider } from '../../context/GetTokenV2Context';
import './index.css';
import bgMainContent from '../../assets/images/bg_main.svg';

const { Content, Footer } = Layout;
const footerStyle = {
    padding: '0.25rem 1.5rem',
    background: '#F5F5F5'
};
const contentStyle = {
    backgroundImage: `url(${bgMainContent})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: 'calc(100vh - 46px - (30px + 1rem))',
    overflowX: 'hidden',
    overflowY: 'auto'
};
const contentErrorStyle = {
    backgroundImage: 'none',
    height: '100vh',
    overflow: 'auto'
};

const UserIndex = () => {
    const { isErrorPage } = useSelector((a) => a.LoadingSlice);

    return (
        <GetTokenV2ContextProvider>
            <Layout style={{ overflow: 'hidden' }}>
                {!isErrorPage && <NavBar />}
                <Content style={isErrorPage ? contentErrorStyle : contentStyle}>
                    <Switch>
                        {routes.map((data, i) => (
                            <Route key={i} exact path={data.path} component={data.component} />
                        ))}
                    </Switch>
                </Content>
                {!isErrorPage && (
                    <Footer style={footerStyle}>
                        <FooterContent />
                    </Footer>
                )}
            </Layout>
        </GetTokenV2ContextProvider>
    );
};

export default UserIndex;
