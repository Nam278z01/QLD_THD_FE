import useAuth from '../../Hook/useAuth';
import HeadProject from '../../components/User/HeadProject';
import PMProject from '../../components/User/PMProject';
import ErrorPage from '../ErrorPage';

function Project() {
    const { isHead, isPM } = useAuth();

    return (
        <>
            {isHead && <HeadProject />}
            {isPM && <PMProject />}
            {!(isHead || isPM) && (
                <ErrorPage
                    title="The page you were looking for is not found!"
                    desc="You may have mistyped the address or the page may have moved."
                />
            )}
        </>
    );
}

export default Project;
