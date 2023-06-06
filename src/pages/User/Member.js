import useAuth from '../../Hook/useAuth';
import HeadMember from '../../components/User/HeadMember';
import PMMember from '../../components/User/PMMember';
import ErrorPage from '../ErrorPage';

function Member() {
    const { isHead, isPM } = useAuth();

    return (
        <>
            {isHead && <HeadMember />}
            {isPM && <PMMember />}
            {!(isHead || isPM) && (
                <ErrorPage
                    title="The page you were looking for is not found!"
                    desc="You may have mistyped the address or the page may have moved."
                />
            )}
        </>
    );
}

export default Member;
