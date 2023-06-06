import Icon from '@ant-design/icons';
import logoSvg from '../assets/icons/ic_logo.svg';
import historySvg from '../assets/icons/ic_history.svg';
import bookSvg from '../assets/icons/ic_book.svg';
import notifySvg from '../assets/icons/ic_notification.svg';
import shopSvg from '../assets/icons/ic_shop.svg';
import walletSvg from '../assets/icons/ic_wallet.svg';
import firstSvg from '../assets/icons/ic_1st.svg';
import secondSvg from '../assets/icons/ic_2nd.svg';
import thirdSvg from '../assets/icons/ic_3rd.svg';
import fourthSvg from '../assets/icons/ic_4th.svg';
import fifthSvg from '../assets/icons/ic_5th.svg';
import topPlusSvg from '../assets/icons/ic_top_plus.svg';
import topMinusSvg from '../assets/icons/ic_top_minus.svg';
import risingStarSvg from '../assets/icons/ic_rising_star.svg';
import dividerSvg from '../assets/icons/ic_divider.svg';
import tagSvg from '../assets/icons/ic_tag.svg';
import arrowUpSvg from '../assets/icons/ic_arrow_up.svg';
import arrowDownSvg from '../assets/icons/ic_arrow_down.svg';
import top1Svg from '../assets/icons/ic_top1.svg';
import top2Svg from '../assets/icons/ic_top2.svg';
import top3Svg from '../assets/icons/ic_top3.svg';
import votedSvg from '../assets/icons/ic_voted.svg';
import unvoteSvg from '../assets/icons/ic_unvote.svg';
import deleteSvg from '../assets/icons/ic_delete.svg';
import alertSuccessSvg from '../assets/icons/ic_alert_success.svg';
import alertErrorSvg from '../assets/icons/ic_alert_error.svg';
import alertInfoSvg from '../assets/icons/ic_alert_info.svg';
import alertWarningSvg from '../assets/icons/ic_alert_warning.svg';
import fptSvg from '../assets/icons/ic_fpt.svg';
import fltSvg from '../assets/icons/ic_flt.svg';
import logo2Svg from '../assets/icons/ic_logo_2.svg';
import errorPageSvg from '../assets/icons/ic_error_page.svg';
import shopCartSvg from '../assets/icons/ic_shop_cart.svg';
import shopUserSvg from '../assets/icons/ic_shop_user.svg';
import shopMenuSvg from '../assets/icons/ic_shop_menu.svg';
import soldSvg from '../assets/icons/ic_sold.svg';
import cloudUpload from '../assets/icons/ic_cloud_upload.svg';
import OnlymeSee from '../assets/icons/ic_lock.svg';
import Bu from '../assets/icons/ic_bu.svg';
import Everyone from '../assets/icons/ic_everyone.svg';
import CameraUploadButton from '../assets/icons/ic_camera.svg';
import arrowRight from '../assets/icons/ic_arrow_right.svg';
import topMonth from '../assets/icons/ic_top_month.svg';
import addCircle from '../assets/icons/ic_add_circle.svg';

function SvgIcon({ svgPath, ...props }) {
    return <Icon component={() => <img src={svgPath} />} {...props} />;
}

const AkaLogoIcon = (props) => <SvgIcon svgPath={logoSvg} {...props} />;
const HistoryIcon = (props) => <SvgIcon svgPath={historySvg} {...props} />;
const BookIcon = (props) => <SvgIcon svgPath={bookSvg} {...props} />;
const NotifyIcon = (props) => <SvgIcon svgPath={notifySvg} {...props} />;
const ShopIcon = (props) => <SvgIcon svgPath={shopSvg} {...props} />;
const WalletIcon = (props) => <SvgIcon svgPath={walletSvg} {...props} />;
const FirstIcon = (props) => <SvgIcon svgPath={firstSvg} {...props} />;
const SecondIcon = (props) => <SvgIcon svgPath={secondSvg} {...props} />;
const ThirdIcon = (props) => <SvgIcon svgPath={thirdSvg} {...props} />;
const FourthIcon = (props) => <SvgIcon svgPath={fourthSvg} {...props} />;
const FifthIcon = (props) => <SvgIcon svgPath={fifthSvg} {...props} />;
const TopPlusIcon = (props) => <SvgIcon svgPath={topPlusSvg} {...props} />;
const TopMinusIcon = (props) => <SvgIcon svgPath={topMinusSvg} {...props} />;
const RisingStarIcon = (props) => <SvgIcon svgPath={risingStarSvg} {...props} />;
const ArrowUpIcon = (props) => <SvgIcon svgPath={arrowUpSvg} {...props} />;
const ArrowDownIcon = (props) => <SvgIcon svgPath={arrowDownSvg} {...props} />;
const Top1Icon = (props) => <SvgIcon svgPath={top1Svg} {...props} />;
const Top2Icon = (props) => <SvgIcon svgPath={top2Svg} {...props} />;
const Top3Icon = (props) => <SvgIcon svgPath={top3Svg} {...props} />;
const UnVoteIcon = (props) => <SvgIcon svgPath={unvoteSvg} {...props} />;
const VotedIcon = (props) => <SvgIcon svgPath={votedSvg} {...props} />;
const DeleteIcon = (props) => <SvgIcon svgPath={deleteSvg} {...props} />;
const SuccessAlertIcon = (props) => <SvgIcon svgPath={alertSuccessSvg} {...props} />;
const ErrorAlertIcon = (props) => <SvgIcon svgPath={alertErrorSvg} {...props} />;
const InfoAlertIcon = (props) => <SvgIcon svgPath={alertInfoSvg} {...props} />;
const WarningAlertIcon = (props) => <SvgIcon svgPath={alertWarningSvg} {...props} />;
const FPTLogoIcon = (props) => <SvgIcon svgPath={fptSvg} {...props} />;
const FLTLogoIcon = (props) => <SvgIcon svgPath={fltSvg} {...props} />;
const AkaLogo2Icon = (props) => <SvgIcon svgPath={logo2Svg} {...props} />;
const ErrorPageIcon = (props) => <SvgIcon svgPath={errorPageSvg} {...props} />;
const ShopCartIcon = (props) => <SvgIcon svgPath={shopCartSvg} {...props} />;
const ShopUserIcon = (props) => <SvgIcon svgPath={shopUserSvg} {...props} />;
const ShopMenuIcon = (props) => <SvgIcon svgPath={shopMenuSvg} {...props} />;
const SoldIcon = (props) => <SvgIcon svgPath={soldSvg} {...props} />;
const CloudUploadImage = (props) => <SvgIcon svgPath={cloudUpload} {...props} />;
const OnlymeSeeProfile = (props) => <SvgIcon svgPath={OnlymeSee} {...props} />;
const BuSeeProfile = (props) => <SvgIcon svgPath={Bu} {...props} />;
const EveryoneSeeProfile = (props) => <SvgIcon svgPath={Everyone} {...props} />;
const CameraButtonUploadImg = (props) => <SvgIcon svgPath={CameraUploadButton} {...props} />;
const ArrowRightIcon = (props) => <SvgIcon svgPath={arrowRight} {...props} />;
const TopMonthIcon = (props) => <SvgIcon svgPath={topMonth} {...props} />;
const AddCircleIcon = (props) => <SvgIcon svgPath={addCircle} {...props} />;

const DividerVector = (props) => <SvgIcon svgPath={dividerSvg} {...props} />;
const TagVector = (props) => <SvgIcon svgPath={tagSvg} {...props} />;

export {
    AkaLogoIcon,
    HistoryIcon,
    BookIcon,
    NotifyIcon,
    ShopIcon,
    WalletIcon,
    FirstIcon,
    SecondIcon,
    ThirdIcon,
    FourthIcon,
    FifthIcon,
    TopPlusIcon,
    TopMinusIcon,
    RisingStarIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    Top1Icon,
    Top2Icon,
    Top3Icon,
    UnVoteIcon,
    VotedIcon,
    DeleteIcon,
    SuccessAlertIcon,
    ErrorAlertIcon,
    InfoAlertIcon,
    WarningAlertIcon,
    FPTLogoIcon,
    AkaLogo2Icon,
    ErrorPageIcon,
    ShopCartIcon,
    ShopUserIcon,
    ShopMenuIcon,
    SoldIcon,
    FLTLogoIcon,
    ArrowRightIcon,
    DividerVector,
    TagVector,
    CloudUploadImage,
    OnlymeSeeProfile,
    BuSeeProfile,
    EveryoneSeeProfile,
    CameraButtonUploadImg,
    TopMonthIcon,
    AddCircleIcon
};
