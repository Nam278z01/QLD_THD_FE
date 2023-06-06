export const reducer = (state, action) => {
  switch (action.type) {
    /* Basic Alerts */
    case "primary":
      return { ...state, primary: false };
    case "secondary":
      return { ...state, secondary: false };
    case "success":
      return { ...state, success: false };
    case "info":
      return { ...state, info: false };
    case "warning":
      return { ...state, warning: false };
    case "danger":
      return { ...state, danger: false };
    case "dark":
      return { ...state, dark: false };
    case "light":
      return { ...state, light: false };

    /* Solid Color Alerts */
    case "solidprimary":
      return { ...state, solidprimary: false };
    case "solidsecondary":
      return { ...state, solidsecondary: false };
    case "solidsuccess":
      return { ...state, solidsuccess: false };
    case "solidinfo":
      return { ...state, solidinfo: false };
    case "solidwarning":
      return { ...state, solidwarning: false };
    case "soliddanger":
      return { ...state, soliddanger: false };
    case "soliddark":
      return { ...state, soliddark: false };
    case "solidlight":
      return { ...state, solidlight: false };

    /* Dismissable Alerts */
    case "disprimary":
      return { ...state, disprimary: false };
    case "dicsecondary":
      return { ...state, disprimary: false };
    case "dissuccess":
      return { ...state, dissuccess: false };
    case "disinfo":
      return { ...state, disinfo: false };
    case "diswarning":
      return { ...state, diswarning: false };
    case "disdanger":
      return { ...state, disdanger: false };
    case "disdark":
      return { ...state, disdark: false };
    case "dislight":
      return { ...state, dislight: false };

    /* Alert Alt */
    case "altprimary":
      return { ...state, altprimary: false };
    case "altsecondary":
      return { ...state, altsecondary: false };
    case "altsuccess":
      return { ...state, altsuccess: false };
    case "altinfo":
      return { ...state, altinfo: false };
    case "altwarning":
      return { ...state, altwarning: false };
    case "altdanger":
      return { ...state, altdanger: false };
    case "altdark":
      return { ...state, altdark: false };
    case "altlight":
      return { ...state, altlight: false };

    /* Solid  Alt*/
    case "altsolidprimary":
      return { ...state, altsolidprimary: false };
    case "altsolidsecondary":
      return { ...state, altsolidsecondary: false };
    case "altsolidsuccess":
      return { ...state, altsolidsuccess: false };
    case "altsolidinfo":
      return { ...state, altsolidinfo: false };
    case "altsolidwarning":
      return { ...state, altsolidwarning: false };
    case "altsoliddanger":
      return { ...state, altsoliddanger: false };
    case "altsoliddark":
      return { ...state, altsoliddark: false };
    case "altsolidlight":
      return { ...state, altsolidlight: false };

    // Dismissable With Solid
    case "soliddisprimary":
      return { ...state, soliddisprimary: false };
    case "soliddicsecondary":
      return { ...state, soliddisprimary: false };
    case "soliddissuccess":
      return { ...state, soliddissuccess: false };
    case "soliddisinfo":
      return { ...state, soliddisinfo: false };
    case "soliddiswarning":
      return { ...state, soliddiswarning: false };
    case "soliddisdanger":
      return { ...state, soliddisdanger: false };
    case "soliddisdark":
      return { ...state, soliddisdark: false };
    case "soliddislight":
      return { ...state, soliddislight: false };

    // Alert With Link
    case "linkprimary":
      return { ...state, linkprimary: false };
    case "linksecondary":
      return { ...state, linksecondary: false };
    case "linksuccess":
      return { ...state, linksuccess: false };
    case "linkinfo":
      return { ...state, linkinfo: false };
    case "linkwarning":
      return { ...state, linkwarning: false };
    case "linkdanger":
      return { ...state, linkdanger: false };
    case "linkdark":
      return { ...state, linkdark: false };
    case "linklight":
      return { ...state, linklight: false };

    // Alert With Link And Solid Color
    case "linksolidprimary":
      return { ...state, linksolidprimary: false };
    case "linksolidsecondary":
      return { ...state, linksolidsecondary: false };
    case "linksolidsuccess":
      return { ...state, linksolidsuccess: false };
    case "linksolidinfo":
      return { ...state, linksolidinfo: false };
    case "linksolidwarning":
      return { ...state, linksolidwarning: false };
    case "linksoliddanger":
      return { ...state, linksoliddanger: false };
    case "linksoliddark":
      return { ...state, linksoliddark: false };
    case "linksolidlight":
      return { ...state, linksolidlight: false };

    // Alert Icon Left
    case "iconprimary":
      return { ...state, iconprimary: false };
    case "iconsecondary":
      return { ...state, iconsecondary: false };
    case "iconsuccess":
      return { ...state, iconsuccess: false };
    case "iconinfo":
      return { ...state, iconinfo: false };
    case "iconwarning":
      return { ...state, iconwarning: false };
    case "icondanger":
      return { ...state, icondanger: false };
    case "icondark":
      return { ...state, icondark: false };
    case "iconlight":
      return { ...state, iconlight: false };

    //Alert Outline
    case "outlineprimary":
      return { ...state, outlineprimary: false };
    case "outlinesecondary":
      return { ...state, outlinesecondary: false };
    case "outlinesuccess":
      return { ...state, outlinesuccess: false };
    case "outlineinfo":
      return { ...state, outlineinfo: false };
    case "outlinewarning":
      return { ...state, outlinewarning: false };
    case "outlinedanger":
      return { ...state, outlinedanger: false };
    case "outlinedark":
      return { ...state, outlinedark: false };
    case "outlinelight":
      return { ...state, outlinelight: false };

    //Alert Social
    case "socialefacebook":
      return { ...state, socialefacebook: false };
    case "socialtwitter":
      return { ...state, socialtwitter: false };
    case "sociallinkdin":
      return { ...state, sociallinkdin: false };
    case "socialgoogle":
      return { ...state, socialgoogle: false };

    //Message Alert
    case "messageprimary":
      return { ...state, messageprimary: false };
    case "messagesecondary":
      return { ...state, messagesecondary: false };
    case "messagesuccess":
      return { ...state, messagesuccess: false };
    case "messageinfo":
      return { ...state, messageinfo: false };
    case "messagewarning":
      return { ...state, messagewarning: false };
    case "messagedanger":
      return { ...state, messagedanger: false };
    case "messagedark":
      return { ...state, messagedark: false };
    case "messagelight":
      return { ...state, messagelight: false };

    //Message Alert With Solid Color
    case "solidmessageprimary":
      return { ...state, solidmessageprimary: false };
    case "solidmessagesecondary":
      return { ...state, solidmessagesecondary: false };
    case "solidmessagesuccess":
      return { ...state, solidmessagesuccess: false };
    case "solidmessageinfo":
      return { ...state, solidmessageinfo: false };
    case "solidmessagewarning":
      return { ...state, solidmessagewarning: false };
    case "solidmessagedanger":
      return { ...state, solidmessagedanger: false };
    case "solidmessagedark":
      return { ...state, solidmessagedark: false };
    case "solidmessagelight":
      return { ...state, solidmessagelight: false };

    //Alert Left Icon Big
    case "iconbigprimary":
      return { ...state, iconbigprimary: false };
    case "iconbigesecondary":
      return { ...state, iconbigsecondary: false };
    case "iconbigsuccess":
      return { ...state, iconbigsuccess: false };
    case "iconbigdanger":
      return { ...state, iconbigdanger: false };

    default:
      return state;
  }
};

export const emojis = {
  welcome: (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="me-2"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
      <line x1="9" y1="9" x2="9.01" y2="9"></line>
      <line x1="15" y1="9" x2="15.01" y2="9"></line>
    </svg>
  ),

  done: (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="me-2"
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
    </svg>
  ),

  success: (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="me-2"
    >
      <polyline points="9 11 12 14 22 4"></polyline>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
  ),

  info: (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="me-2"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  ),

  warning: (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="me-2"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  ),

  error: (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="me-2"
    >
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  ),
};
