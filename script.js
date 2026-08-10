const languages = {
	en: () => import("./en_dict.js"),
	pt: () => import("./pt_dict.js"),
	es: () => import("./es_dict.js"),
};

/**
 * @type {IDBDatabase}
 */
let db;
const dbOpenReq = indexedDB.open("crown");
dbOpenReq.onsuccess = function (ev) {
	db = ev.target.result;
	console.log("Banco de dados aberto.");
};

dbOpenReq.onupgradeneeded = function (ev) {
	db = ev.target.result;

	const objectStore = db.createObjectStore("users", { keyPath: "email" });
	objectStore.createIndex("email", "email", { unique: true });
	objectStore.createIndex("username", "name", { unique: false });
	console.log("Banco de dados criado pela primeira vez.");
};

let intl;
let atualLang;
const currency = {"pt": "BRL", "en": "USD", "es": "EUR"};
const worth = {"pt": 1, "en": 5.1, "es": 5.89}

const translationKeys = {
	title: "title",
	"brand-name": "brandName",
	"nav-discover": "navDiscover",
	"nav-about": "navAbout",
	"nav-booking": "navBooking",
	"btn-login": "btnLogin",
	"btn-register": "btnRegister",
	"hero-title": "heroTitle",
	"hero-subtitle": "heroSubtitle",
	"btn-explore": "btnExplore",
	"about-title": "aboutTitle",
	"about-desc": "aboutDescription",
	"feature-1-title": "feature1Title",
	"feature-1-desc": "feature1Description",
	"feature-2-title": "feature2Title",
	"feature-2-desc": "feature2Description",
	"feature-3-title": "feature3Title",
	"feature-3-desc": "feature3Description",
	"feature-4-title": "feature4Title",
	"feature-4-desc": "feature4Description",
	"booking-title": "bookingTitle",
	"booking-subtitle": "bookingSubtitle",
	"label-from": "labelFrom",
	"label-to": "labelTo",
	"label-departure": "labelDeparture",
	"label-return": "labelReturn",
	"label-passengers": "labelPassengers",
	"label-class": "labelClass",
	"option-economy": "optionEconomy",
	"option-premium": "optionPremium",
	"option-business": "optionBusiness",
	"option-first": "optionFirst",
	"btn-search": "btnSearch",
	"footer-company": "footerCompany",
	"footer-about": "footerAbout",
	"footer-career": "footerCareer",
	"footer-press": "footerPress",
	"footer-support": "footerSupport",
	"footer-contact": "footerContact",
	"footer-faq": "footerFAQ",
	"footer-help": "footerHelp",
	"footer-legal": "footerLegal",
	"footer-privacy": "footerPrivacy",
	"footer-terms": "footerTerms",
	"footer-cookies": "footerCookies",
	"footer-copyright": "footerCopyright",
	"placeholder-from": "placeholderFrom",
	"placeholder-to": "placeholderTo",
	"one-way": "oneWay",
	"correctly-repeat-password": "correctlyRepeatPassword",
	"user-creation-success": "userCreationSuccess",
	"user-creation-error": "userCreationError",
	"user-already-exists": "userAlreadyExists",
	"wrong-password": "wrongPassword",
	"no-user": "noUser",
	"flight-search-complete": "flightSearchComplete",
	"booking-completed": "bookingCompleted",
	"enter-departure-city": "enterDepartureCity",
	"incomplete-details": "incompleteDetails",
	"passanger": "passanger",
	"passangers": "passangers",
	"password": "password",
	"repeat-password": "repeatPassword",
	"username": "username",
	"halong-resume": "halongResume",
	"halong-desc1": "halongDesc1",
	"halong-desc2": "halongDesc2",
	"halong-desc3": "halongDesc3",
	"halong-desc4": "halongDesc4",
	"halong-feature-desc1": "halongFeatureDesc1",
	"halong-feature-desc2": "halongFeatureDesc2",
	"halong-feature-desc3": "halongFeatureDesc3",
	"halong-feature-desc4": "halongFeatureDesc4",
	"halong-feature-title1": "halongFeatureTitle1",
	"halong-feature-title2": "halongFeatureTitle2",
	"halong-feature-title3": "halongFeatureTitle3",
	"halong-feature-title4": "halongFeatureTitle4",
	"prices-eyebrow": "pricesEyebrow",
	"duration": "duration",
	"journey-data": "journeyData",
	"package-summary": "packageSummary",
	"prices-desc": "pricesDesc",
	"breakdown-title": "spendingBreakdownTitle",
	"breakdown-desc": "spendingBreakdownDesc",
	"item": "item",
	"package": "package",
	"price": "price",
	"flight": "flight",
	"hotel": "hotel",
	"transport": "transport",
	"cruise-item": "cruiseItem",
	"food": "food",
	"total-complete": "totalComplete",
	"economic-package": "economicPackage",
	"luxury-package": "luxuryPackage",
	"economic-hotel": "economicHotel",
	"luxury-hotel": "luxuryHotel",
	"cruise": "cruise",
	"economic-cruise": "economicCruise",
	"luxury-cruise": "luxuryCruise",
	"experiences": "experiences",
	"economic-xp": "economicXp",
	"luxury-xp": "luxuryXp",
	"economic-price": "economicPrice",
	"luxury-price": "luxuryPrice",
	"full-package": "fullPackage",
	"payment": "payment",
	"staying": "staying",
	"includes": "includes",
	"economic-note": "economicNote",
	"luxury-staying": "luxuryStaying",
	"luxury-includes": "luxuryIncludes",
	"luxury-note": "luxuryNote",
	"overall-plan": "overallPlan",
	"plan-text": "planText",
	"plan-coverage": "planCoverage",
	"day-1": "day1",
	"day-1-desc": "day1Desc",
	"day-2": "day2",
	"day-2-desc": "day2Desc",
	"day-3": "day3",
	"day-3-desc": "day3Desc",
	"day-4": "day4",
	"day-4-desc": "day4Desc",
	"day-5": "day5",
	"day-5-desc": "day5Desc",
	"when-to-go-eyebrow": "whenToGoEyebrow",
	"good-climate": "goodClimate",
	"when-to-go": "whenToGo",
	"spring": "spring",
	"timespan1": "timespan1",
	"temp": "temp",
	"fall": "fall",
	"timespan2": "timespan2",
	"climate-condition": "climateCondition",
	"climate-desc": "climateDesc",

	/* custom booking section translations */
	"select-package": "selectPackage",
	"confirm-reservation": "confirmReservation",
	"selected-package-none": "selectedPackageNone",
	"price-subtotal": "priceSubtotal",
	"price-total": "priceTotal",
};

function selectLanguage(lang) {
	console.log(lang);
	updateDocumentLanguage(lang);
	document.querySelectorAll(".lang-btn").forEach((button) => {
		button.classList.toggle("active", button.textContent === lang.toUpperCase());
	});
	localStorage.setItem("selectedLanguage", lang);
}

function updateDocumentLanguage(lang) {
	const loader = languages[lang];
	if (!loader) return;

	loader().then((module) => {
		const dict = module.default;
		intl = dict;
		atualLang = lang;

		document.querySelectorAll("[data-title]").forEach((element) => {
			if (dict.title) element.textContent = dict.title;
		});

		for (const [dataKey, translationKey] of Object.entries(translationKeys)) {
			document.querySelectorAll(`[data-${dataKey}]`).forEach((element) => {
				const text = dict[translationKey];
				if (!text) return;
				const tag = element.tagName.toLowerCase();
				if (tag === "input" && element.type !== "button") {
					element.placeholder = text;
				} else {
					element.textContent = text;
				}
			});
		}
	});
}

let activeIndex = 0;
let bannerTimer;

function changeBanner(index) {
	const banners = document.querySelectorAll(".hero-banner");
	const indicators = document.querySelectorAll(".indicator");
	activeIndex = index % banners.length;
	banners.forEach((banner, i) => banner.classList.toggle("active", i === activeIndex));
	indicators.forEach((indicator, i) => indicator.classList.toggle("active", i === activeIndex));
}

function startBannerRotation() {
	bannerTimer = setInterval(
		() => changeBanner((activeIndex + 1) % document.querySelectorAll(".hero-banner").length),
		5000,
	);
}

function stopBannerRotation() {
	clearInterval(bannerTimer);
}

function getBookingData() {
	const from = document.getElementById("from").value.trim();
	const to = document.getElementById("to").value.trim();
	const departureDate = document.getElementById("departure-date").value;
	const returnDate = document.getElementById("return-date").value;
	const passengers = document.getElementById("passengers").value;
	const travelClass = document.getElementById("class").selectedOptions[0].text;
	const packageType = document.getElementById("selected-package-type") ? document.getElementById("selected-package-type").value : "";
	const packagePrice = document.getElementById("selected-package-price") ? parseFloat(document.getElementById("selected-package-price").value) : 0;
	return { from, to, departureDate, returnDate, passengers, travelClass, packageType, packagePrice };
}

function renderBookingResult(data) {
	const result = document.getElementById("booking-result");
	// sanitize simple values to avoid accidental HTML injection
	function escapeHtml(str) {
		if (!str && str !== 0) return "";
		return String(str)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	const returnText = data.returnDate ? escapeHtml(data.returnDate) : escapeHtml(intl.oneWay);
	const passengerText = data.passengers === "1" ? escapeHtml(intl.passanger) : escapeHtml(intl.passangers);

	// Set visual state
	result.classList.remove("success", "error");
	const isError = data.status === intl.incompleteDetails || data.status === intl.userCreationError;
	result.classList.add(isError ? "error" : "success");

	result.innerHTML = `
		<div class="booking-result-card">
			<div class="booking-result-header">
				<h3 class="booking-status">${escapeHtml(data.status)}</h3>
				<p class="booking-message">${escapeHtml(data.message)}</p>
			</div>
			<div class="booking-result-body">
				<ul class="booking-summary">
					<li><strong>${escapeHtml(data.from)}</strong> → <strong>${escapeHtml(data.to)}</strong></li>
					<li>${escapeHtml(data.departureDate)} — ${returnText}</li>
					<li>${escapeHtml(data.passengers)} ${passengerText}</li>
					<li>${escapeHtml(data.travelClass)}</li>
					${data.total ? `<li><strong>Total:</strong> ${escapeHtml(data.total)}</li>` : ""}
				</ul>
			</div>
		</div>
	`;
}

// Helper: format currency using locale
function formatCurrency(value) {
	try {
		return new Intl.NumberFormat(atualLang, { style: 'currency', currency: currency[atualLang] }).format(value);
	} catch (err) {
		return 'R$ ' + Number(value).toFixed(2);
	}
}

function calculateTotals(basePrice, passengers) {
	const pax = Number(passengers) || 1;
	const subtotal = Number(basePrice) * pax;
	const total = subtotal;
	return { subtotal, total };
}

function updatePriceSummary() {
	const base = parseFloat(document.getElementById('selected-package-price')?.value || 0) / worth[atualLang];
	const passengers = document.getElementById('passengers')?.value || 1;
	const subtotalEl = document.getElementById('price-subtotal');
	const totalEl = document.getElementById('price-total');

	if (!subtotalEl || !totalEl) return;

	if (!base || base <= 0) {
		subtotalEl.textContent = '—';
		totalEl.textContent = '—';
		return;
	}

	const { subtotal, total } = calculateTotals(base, passengers);
	subtotalEl.textContent = formatCurrency(subtotal);
	totalEl.textContent = formatCurrency(total);
}

function selectPackage(type) {
	const tiles = document.querySelectorAll('.package-tile');
	tiles.forEach((t) => t.classList.toggle('selected', t.dataset.packageType === type));
	const selected = document.querySelector(`.package-tile[data-package-type="${type}"]`);
	if (!selected) return;
	const name = selected.querySelector('.package-badge')?.textContent || type;
	const displayPrice = selected.querySelector('.tile-price')?.textContent || '';
	const basePrice = Number(selected.dataset.basePrice) || 0;
	document.getElementById('selected-package-type').value = type;
	document.getElementById('selected-package-price').value = basePrice;
	document.querySelector('#selected-package .selected-package-name').textContent = name;
	document.querySelector('#selected-package .selected-package-price').textContent = displayPrice;
	updatePriceSummary();
}

function attachPackageListeners() {
	document.querySelectorAll('.btn-select-package').forEach((btn) => {
		btn.addEventListener('click', () => selectPackage(btn.closest('.package-tile').dataset.packageType));
	});
}

function initCheckoutInteractions() {
	attachPackageListeners();
	document.getElementById('passengers')?.addEventListener('change', updatePriceSummary);
	document.getElementById('class')?.addEventListener('change', updatePriceSummary);
	// initial summary update in case user has preselection
	updatePriceSummary();
}

function handleBookingSubmit(event) {
	event.preventDefault();
	const data = getBookingData();

	// require selected package
	if (!data.packageType || !data.packagePrice || data.packagePrice <= 0) {
		renderBookingResult({
			status: intl.incompleteDetails,
			message: intl.selectPackageRequired,
			...data,
		});
		return;
	}

	if (!data.from || !data.departureDate) {
		renderBookingResult({
			status: intl.incompleteDetails,
			message: intl.enterDepartureCity,
			...data,
		});
		return;
	}

	// compute totals and show confirmation summary
	const totals = calculateTotals(Number(data.packagePrice), Number(data.passengers));
	const formattedTotal = formatCurrency(totals.total);

	renderBookingResult({
		status: intl.flightSearchComplete,
		message: intl.reservationReceived ? intl.reservationReceived.replace('{total}', formattedTotal) : `Reservation received — total ${formattedTotal}`,
		...data,
		total: formattedTotal,
	});
}

function showLoginModal() {
	document.querySelector("#login-dialog").showModal();
}

function showRegisterModal() {
	document.querySelector("#register-dialog").showModal();
}

function handleLogin(email, password) {
	const userReq = db.transaction(["users"]).objectStore("users").get(email);
	userReq.onsuccess = (ev) => {
		const user = userReq.result;
		if (user === undefined) {
			alert(intl.noUser);
			return;
		}

		if (user.password !== password) {
			alert(intl.wrongPassword);
			return;
		}

		localStorage.setItem("loggedUser", JSON.stringify({ email: email, password: password }));
		document.querySelector(".auth-wrapper").remove();
		const userWrraper = document.createElement("div");
		userWrraper.classList.add("user-wrapper");
		const userName = document.createElement("span");
		userName.textContent = user.name;

		const pfp = new Image();
		pfp.src = user.picture;

		userWrraper.appendChild(userName);
		userWrraper.appendChild(pfp);
		document.querySelector(".header-actions").appendChild(userWrraper);
	};
}

function handleRegister(email, username, password) {
	const objectStore = db.transaction(["users"], "readwrite").objectStore("users");
	objectStore.get(email).onsuccess = (ev) => {
		if (ev.target.result) {
			alert(intl.userAlreadyExists);
			return;
		}

		const addReq = objectStore.add({
			email: email,
			password: password,
			name: username,
			picture: "img/default.png",
		});
		addReq.onerror = (ev) => {
			alert(intl.userCreatingError);
		};

		addReq.onsuccess = (ev) => {
			alert(intl.userCreationSuccess);
			handleLogin(email, password);
		};
	};
}

function autoLogin() {
	if (localStorage.getItem("loggedUser")) {
		const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
		handleLogin(loggedUser.email, loggedUser.password);
	} else {
		document.getElementById("login-form").addEventListener("submit", function (ev) {
			ev.preventDefault();
			this.parentElement.close(); // login dialog

			const email = document.querySelector("#email-login").value;
			const password = document.querySelector("#password-login").value;
			handleLogin(email, password);
		});
		document.getElementById("register-form").addEventListener("submit", function (ev) {
			ev.preventDefault();
			this.parentElement.close(); // register dialog

			const password = document.querySelector("#password-register").value;
			const repeatedPassword = document.querySelector("#password-repeat").value;

			if (password !== repeatedPassword) {
				alert(intl.correctlyRepeatPassword);
				return;
			}

			const email = document.querySelector("#email-register").value;
			const username = document.querySelector("#user-name").value;

			handleRegister(email, username, password);
		});
		document.querySelector("#login-btn").addEventListener("click", showLoginModal);
		document.querySelector("#register-btn").addEventListener("click", showRegisterModal);
	}
}

function setInitialTranslations() {
	if (localStorage.getItem("selectedLanguage")) {
		selectLanguage(localStorage.getItem("selectedLanguage"));
		return;
	}

	for (let i = 0; i < navigator.languages.length; i++) {
		if (Object.keys(languages).includes(navigator.languages[i])) {
			selectLanguage(navigator.languages[i]);
			console.log(navigator.languages[i]);
			localStorage.setItem("selectedLanguage", navigator.languages[i]);
			return;
		} else if (Object.keys(languages).includes(navigator.languages[i].split("-")[0])) {
			const lang = navigator.languages[i].split("-")[0];
			selectLanguage(lang);
			localStorage.setItem("selectedLanguage", lang);
			return;
		}
	}
}

function expandNavBar() {
	const navbar = document.getElementById("navbar-container");
	navbar.classList.toggle("expanded");

	const expander = document.querySelector("#navbar-expander");
	if (navbar.classList.contains("expanded")) {
		expander.textContent = "^";
	} else {
		expander.textContent = "v";
	}
}

window.selectLanguage = selectLanguage;
window.changeBanner = changeBanner;

window.addEventListener("DOMContentLoaded", () => {
	setInitialTranslations();
	setTimeout(autoLogin, 500); // to wait for the db to load.
	document.getElementById("booking-form").addEventListener("submit", handleBookingSubmit);
	document.getElementById("navbar-expander").addEventListener("click", expandNavBar);
	document.querySelectorAll("button.cancel.action").forEach((btn) => {
		btn.addEventListener("click", function () {
			// button > actions-wrraper > form > dialog
			btn.parentElement.parentElement.parentElement.close();
		});
	});
	document.querySelectorAll(".hero-banner").forEach((banner) => {
		banner.addEventListener("mouseenter", stopBannerRotation);
		banner.addEventListener("mouseleave", startBannerRotation);
	});
	// initialize booking interactions
	initCheckoutInteractions();
	startBannerRotation();
});
