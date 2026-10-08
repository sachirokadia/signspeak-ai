import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Reveal-BREbqJbe.js
var import_jsx_runtime = require_jsx_runtime();
var variants = {
	hidden: {
		opacity: 0,
		y: 18,
		filter: "blur(6px)"
	},
	visible: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)"
	}
};
function Reveal({ children, delay = 0, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		className,
		variants,
		initial: "hidden",
		whileInView: "visible",
		viewport: {
			once: true,
			margin: "-80px"
		},
		transition: {
			duration: .65,
			delay,
			ease: [
				.22,
				1,
				.36,
				1
			]
		},
		children
	});
}
//#endregion
export { Reveal as t };
