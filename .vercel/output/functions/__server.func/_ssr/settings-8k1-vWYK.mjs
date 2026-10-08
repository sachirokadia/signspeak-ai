import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as ChevronUp, I as ChevronDown, L as Check } from "../_libs/lucide-react.mjs";
import { i as cn, r as Navbar, t as Button } from "./Navbar-DqEYdomU.mjs";
import { t as Footer } from "./Footer-CVa6tLP-.mjs";
import { t as Reveal } from "./Reveal-BREbqJbe.mjs";
import { t as Label } from "./label-sLQh1eXl.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
import { n as Switch, t as Slider } from "./switch-DHNdwtX3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-8k1-vWYK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
function SettingsCard({ heading, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "glass-panel rounded-3xl p-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-base font-semibold",
				children: heading
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: hint
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 space-y-6",
				children
			})
		]
	});
}
function Row({ label, description, control, htmlFor }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor,
				className: "text-sm font-medium",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: description
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shrink-0",
			children: control
		})]
	});
}
function Settings() {
	const [vocabulary, setVocabulary] = (0, import_react.useState)("asl");
	const [voice, setVoice] = (0, import_react.useState)("warm");
	const [sensitivity, setSensitivity] = (0, import_react.useState)(72);
	const [rate, setRate] = (0, import_react.useState)(1);
	const [autoSpeak, setAutoSpeak] = (0, import_react.useState)(true);
	const [saveHistory, setSaveHistory] = (0, import_react.useState)(true);
	const [largeText, setLargeText] = (0, import_react.useState)(false);
	const [reduceMotion, setReduceMotion] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-3xl px-5 py-14",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-semibold",
						children: "Settings"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Preferences apply instantly and are stored on this device."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SettingsCard, {
								heading: "Recognition",
								hint: "How the model interprets your hands.",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									htmlFor: "vocabulary",
									label: "Gesture vocabulary",
									description: "Base sign set used for matching.",
									control: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: vocabulary,
										onValueChange: setVocabulary,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "vocabulary",
											className: "w-40",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "asl",
												children: "ASL (English)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "bsl",
												children: "BSL (British)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "custom",
												children: "Custom pack"
											})
										] })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "sensitivity",
											className: "text-sm font-medium",
											children: "Detection sensitivity"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [sensitivity, "%"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: "Higher values react faster but may produce more false positives."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										id: "sensitivity",
										className: "mt-4",
										value: [sensitivity],
										min: 30,
										max: 100,
										step: 1,
										onValueChange: ([value]) => setSensitivity(value ?? 70)
									})
								] })]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
								delay: .06,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SettingsCard, {
									heading: "Voice output",
									hint: "How translated phrases are spoken.",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											htmlFor: "voice",
											label: "Voice",
											description: "Applies to all spoken output.",
											control: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: voice,
												onValueChange: setVoice,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													id: "voice",
													className: "w-40",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "warm",
														children: "Warm"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "neutral",
														children: "Neutral"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "bright",
														children: "Bright"
													})
												] })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											htmlFor: "auto-speak",
											label: "Speak automatically",
											description: "Play each recognised phrase as soon as it's confident.",
											control: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
												id: "auto-speak",
												checked: autoSpeak,
												onCheckedChange: setAutoSpeak
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "rate",
												className: "text-sm font-medium",
												children: "Speech rate"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground",
												children: [rate.toFixed(1), "×"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
											id: "rate",
											className: "mt-4",
											value: [rate],
											min: .5,
											max: 1.8,
											step: .1,
											onValueChange: ([value]) => setRate(value ?? 1)
										})] })
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
								delay: .12,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SettingsCard, {
									heading: "Accessibility",
									hint: "Make the interface fit how you read and move.",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										htmlFor: "large-text",
										label: "Larger text",
										description: "Increase base font size across the app.",
										control: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											id: "large-text",
											checked: largeText,
											onCheckedChange: setLargeText
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										htmlFor: "reduce-motion",
										label: "Reduce motion",
										description: "Disable non-essential animations and transitions.",
										control: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											id: "reduce-motion",
											checked: reduceMotion,
											onCheckedChange: setReduceMotion
										})
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
								delay: .18,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SettingsCard, {
									heading: "Privacy & data",
									hint: "Nothing is uploaded. You control what is kept.",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										htmlFor: "save-history",
										label: "Save gesture history",
										description: "Store translated phrases locally on this device.",
										control: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											id: "save-history",
											checked: saveHistory,
											onCheckedChange: setSaveHistory
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										className: "h-11 rounded-full px-5",
										onClick: () => toast("History cleared", { description: "All stored phrases were removed." }),
										children: "Clear stored history"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "bg-brand h-12 w-full rounded-full text-[15px]",
								onClick: () => toast("Preferences saved"),
								children: "Save preferences"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { Settings as component };
