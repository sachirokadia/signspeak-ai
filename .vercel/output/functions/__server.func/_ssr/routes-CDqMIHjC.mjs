import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Trigger2, i as Root2, n as Header, r as Item, t as Content2, v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { I as ChevronDown, T as HeartHandshake, V as ArrowRight, f as Quote, o as Sparkles, r as Volume2 } from "../_libs/lucide-react.mjs";
import { i as cn, r as Navbar, t as Button } from "./Navbar-DqEYdomU.mjs";
import { t as Footer } from "./Footer-CVa6tLP-.mjs";
import { n as animate, t as useInView } from "../_libs/framer-motion.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { t as Reveal } from "./Reveal-BREbqJbe.mjs";
import { t as SectionHeading } from "./SectionHeading-DI-fwinA.mjs";
import { n as HowItWorks, t as Features } from "./HowItWorks-D6Xkq1-Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CDqMIHjC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var chips = [
	"Hello",
	"Thank you",
	"Yes",
	"Water",
	"Help"
];
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "bg-soft relative overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid-backdrop pointer-events-none absolute inset-0",
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto grid max-w-6xl gap-14 px-5 pt-20 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-28",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 14
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .6,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					className: "inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "h-3.5 w-3.5 text-primary",
						"aria-hidden": "true"
					}), "Real-time gesture intelligence, running on-device"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.h1, {
					initial: {
						opacity: 0,
						y: 20
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .7,
						delay: .08,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					className: "mt-6 text-4xl leading-[1.05] font-semibold text-balance sm:text-5xl lg:text-6xl",
					children: [
						"Every gesture deserves ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gradient",
							children: "a voice"
						}),
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
					initial: {
						opacity: 0,
						y: 20
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .7,
						delay: .16,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					className: "mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty",
					children: "SignSpeak AI reads hand signs through your webcam and converts them into written words and natural speech — instantly, privately, and with confidence you can see."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 20
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .7,
						delay: .24,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					className: "mt-9 flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						className: "bg-brand h-12 rounded-full px-6 text-[15px] shadow-lift transition-transform hover:scale-[1.02]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard",
							children: ["Start translating", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "ml-1 h-4 w-4",
								"aria-hidden": "true"
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						size: "lg",
						className: "h-12 rounded-full border-border bg-background/70 px-6 text-[15px] backdrop-blur",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/features",
							children: "See how it works"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-xs text-muted-foreground",
					children: "No sign-up required · Camera frames never leave your device"
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 28,
					scale: .97
				},
				animate: {
					opacity: 1,
					y: 0,
					scale: 1
				},
				transition: {
					duration: .85,
					delay: .2,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				className: "glass-panel rounded-3xl p-4 sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-[4/3] overflow-hidden rounded-2xl bg-foreground/90",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,oklch(0.6_0.18_262/0.55),transparent_60%),radial-gradient(circle_at_75%_75%,oklch(0.55_0.22_293/0.5),transparent_60%)]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							className: "absolute inset-x-10 inset-y-8 rounded-2xl border border-white/40",
							animate: {
								opacity: [
									.35,
									.9,
									.35
								],
								scale: [
									.98,
									1,
									.98
								]
							},
							transition: {
								duration: 3.2,
								repeat: Infinity,
								ease: "easeInOut"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 animate-pulse rounded-full bg-emerald-400" }), "Live camera"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute right-4 bottom-4 left-4 rounded-xl bg-white/90 p-4 backdrop-blur",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Detected phrase"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display mt-1 text-lg font-semibold",
									children: "“Thank you for helping me.”"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-1.5 flex-1 overflow-hidden rounded-full bg-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
												className: "bg-brand h-full rounded-full",
												animate: { width: [
													"55%",
													"96%",
													"72%"
												] },
												transition: {
													duration: 4,
													repeat: Infinity,
													ease: "easeInOut"
												}
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold text-primary",
											children: "96%"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
											className: "h-4 w-4 text-muted-foreground",
											"aria-hidden": "true"
										})
									]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: chips.map((chip, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
						initial: {
							opacity: 0,
							y: 8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							delay: .6 + i * .08,
							duration: .4
						},
						className: "rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground",
						children: chip
					}, chip))
				})]
			})]
		})]
	});
}
function Mission() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-6xl px-5 py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-lift sm:p-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,oklch(0.55_0.22_293/0.22),transparent_70%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,oklch(0.6_0.18_258/0.2),transparent_70%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartHandshake, {
								className: "h-5 w-5",
								"aria-hidden": "true"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-6 text-3xl font-semibold text-balance sm:text-4xl",
							children: "Accessibility isn't a feature. It's the whole product."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-xl leading-relaxed text-muted-foreground text-pretty",
							children: "Over 70 million people worldwide use sign language as a first language, yet most everyday spaces — clinics, classrooms, counters — have no interpreter. SignSpeak AI exists to close that gap with technology that respects both privacy and dignity."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-xl leading-relaxed text-muted-foreground text-pretty",
							children: "We build with the Deaf and non-verbal community, not for them: every release is tested with screen readers, high-contrast modes, keyboard-only navigation and real signers."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							className: "bg-brand mt-8 h-12 rounded-full px-6 shadow-soft transition-transform hover:scale-[1.02]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/about",
								children: "Read our mission"
							})
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-4",
						children: [
							["Co-designed", "Built alongside Deaf advocates and speech therapists."],
							["Zero upload", "Frames processed locally and discarded immediately."],
							["Always readable", "AA contrast, scalable type, full keyboard support."]
						].map(([title, body]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "glass-panel rounded-2xl p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold",
								children: title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: body
							})]
						}, title))
					})]
				})
			]
		}) })
	});
}
var stats = [
	{
		value: 98.4,
		suffix: "%",
		label: "Recognition accuracy",
		detail: "On the core 250-sign vocabulary"
	},
	{
		value: 42,
		suffix: "ms",
		label: "Median latency",
		detail: "Gesture to rendered text"
	},
	{
		value: 250,
		suffix: "+",
		label: "Supported gestures",
		detail: "ASL, BSL and custom packs"
	},
	{
		value: 12,
		suffix: "k",
		label: "Daily conversations",
		detail: "Translated across 34 countries"
	}
];
function Counter({ value, suffix }) {
	const ref = (0, import_react.useRef)(null);
	const inView = useInView(ref, {
		once: true,
		margin: "-60px"
	});
	const [display, setDisplay] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!inView) return;
		const controls = animate(0, value, {
			duration: 1.4,
			ease: [
				.22,
				1,
				.36,
				1
			],
			onUpdate: (latest) => setDisplay(latest)
		});
		return () => controls.stop();
	}, [inView, value]);
	const formatted = Number.isInteger(value) ? Math.round(display) : display.toFixed(1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref,
		className: "text-gradient font-display text-4xl font-semibold sm:text-5xl",
		children: [formatted, suffix]
	});
}
function Stats() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-y border-border bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto grid max-w-6xl gap-6 px-5 py-20 sm:grid-cols-2 lg:grid-cols-4",
			children: stats.map((stat, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i * .08,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6 shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Counter, {
							value: stat.value,
							suffix: stat.suffix
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm font-semibold",
							children: stat.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: stat.detail
						})
					]
				})
			}, stat.label))
		})
	});
}
var testimonials = [
	{
		quote: "For the first time my son ordered his own coffee. He signed, the phone spoke, and the barista just answered him. That's it. That's the whole thing.",
		name: "Amara Osei",
		role: "Parent · Manchester"
	},
	{
		quote: "We keep a tablet with SignSpeak at triage. Waiting for an interpreter used to cost us forty minutes; now we start the intake immediately.",
		name: "Dr. Liam Reyes",
		role: "Emergency physician · Lisbon"
	},
	{
		quote: "The confidence score is what sold me. I can see when the model is unsure and correct it before it speaks something wrong.",
		name: "Sofia Lindqvist",
		role: "ASL interpreter · Stockholm"
	}
];
function Testimonials() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-5 py-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "Testimonials",
			title: "Voices from the people using it daily",
			description: "Clinics, classrooms and kitchen tables — wherever a conversation needs to happen."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-14 grid gap-5 lg:grid-cols-3",
			children: testimonials.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i * .08,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, {
							className: "h-6 w-6 text-primary/40",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
							className: "mt-4 flex-1 leading-relaxed text-pretty",
							children: [
								"“",
								item.quote,
								"”"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
							className: "mt-6 flex items-center gap-3 border-t border-border pt-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-brand grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-primary-foreground",
								children: item.name.charAt(0)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm font-semibold",
									children: item.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-xs text-muted-foreground",
									children: item.role
								})]
							})]
						})
					]
				})
			}, item.name))
		})]
	});
}
var Accordion = Root2;
var AccordionItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
	className: "flex",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger2, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = Trigger2.displayName;
var AccordionContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = Content2.displayName;
var faqs = [
	{
		q: "Does my video get uploaded anywhere?",
		a: "No. Gesture recognition runs entirely in your browser. Frames are analysed and immediately discarded — only the resulting text is kept, and only if you enable history."
	},
	{
		q: "Which sign languages are supported?",
		a: "The core model covers 250+ ASL and BSL signs, including the full fingerspelling alphabet. You can also record custom gestures for personal signs, names and frequently used phrases."
	},
	{
		q: "What hardware do I need?",
		a: "Any device with a webcam and a modern browser. A standard laptop camera or a mid-range phone is enough; no depth sensor, glove or external hardware is required."
	},
	{
		q: "How accurate is it in low light?",
		a: "Accuracy stays above 90% in typical indoor lighting. The dashboard surfaces a live confidence score and warns you when lighting or framing is degrading the prediction."
	},
	{
		q: "Can it work offline?",
		a: "Yes. Once the model is cached, translation and speech output continue to work without a network connection."
	},
	{
		q: "Is it accessible to screen reader users?",
		a: "Every control is keyboard reachable and labelled, translated text is announced through a live region, and the interface meets WCAG 2.2 AA contrast requirements."
	}
];
function FAQ() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-t border-border bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-5 py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "FAQ",
				title: "Questions, answered"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: .1,
				className: "mt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
					type: "single",
					collapsible: true,
					className: "w-full",
					children: faqs.map((faq) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
						value: faq.q,
						className: "border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
							className: "text-left text-base font-semibold hover:no-underline",
							children: faq.q
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
							className: "text-sm leading-relaxed text-muted-foreground",
							children: faq.a
						})]
					}, faq.q))
				})
			})]
		})
	});
}
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Features, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mission, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stats, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Testimonials, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQ, {})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { Index as component };
