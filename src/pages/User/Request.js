import HeadRequest from '../../components/User/HeadRequest';
import MemberRequest from '../../components/User/MemberRequest';
import PMRequest from '../../components/User/PMRequest';
import useAuth from '../../Hook/useAuth';

function Request() {
    const { isHead, isPM, isMember } = useAuth();

    return (
        <>
            {isMember && <MemberRequest />}
            {isHead && <HeadRequest />}
            {isPM && <PMRequest />}
        </>
    );
}

export default Request;
