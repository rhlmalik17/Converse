import "./Icons.css"


/* RETURN CUSTOM SVG MARKUP FOR ICONS AND MANIPULATE THEM VIA PROPS */
export const SendIcon = (props: any) => {
  return (
    <svg className={"ci-send" +(props.className) ? props.className : ""} xmlns="http://www.w3.org/2000/svg" width="21.604" height="18.537" viewBox="0 0 21.604 18.537">
      <path className={ "ci " + ((props.active) ? " ci-active" : "") } style={{ transition: "0.6s ease" }} id="send" d="M1547.426,14831.956l18.3-7.736c.821-.357.631-.714-.072-1.191l-18.322-7.618c-.786-.238-1.012.118-.917.715v5.594l7.679,1.787c.548.117.75.237.024.356l-7.7,1.9V14831C1546.414,14832.2,1546.807,14832.314,1547.426,14831.956Z" transform="translate(-1545.527 -14814.469)" fill="none" stroke-width="1.73" fill-rule="evenodd" />
    </svg>
  );
}
