const GOOGLE_ANALYTICS_KEY = process.env.GOOGLE_ANALYTICS_KEY;

export const GOOGLE_TAG_MANAGER = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GOOGLE_ANALYTICS_KEY}');
`;

export const GOOGLE_TAG_MANAGER_NO_SCRIPT = `
  <iframe 
    src="https://www.googletagmanager.com/ns.html?id=${GOOGLE_ANALYTICS_KEY}"
    height="0" 
    width="0" 
    style="display:none;visibility:hidden"
  ></iframe>
`;
