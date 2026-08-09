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
	return { from, to, departureDate, returnDate, passengers, travelClass };
}

function renderBookingResult(data) {
	const result = document.getElementById("booking-result");
	const returnText = data.returnDate ? data.returnDate : "One-way";
	const passengerText = data.passengers === "1" ? "passenger" : "passengers";

	result.innerHTML = `
        <strong>${data.status}</strong>
        <p>${data.message}</p>
        <ul>
            <li><strong>${data.from}</strong> → <strong>${data.to}</strong></li>
            <li>${data.departureDate} — ${returnText}</li>
            <li>${data.passengers} ${passengerText}</li>
            <li>${data.travelClass}</li>
        </ul>
    `;
}

function handleBookingSubmit(event) {
	event.preventDefault();
	const data = getBookingData();

	if (!data.from || !data.departureDate) {
		renderBookingResult({
			status: "Incomplete details",
			message: "Please enter your departure city and date before searching for flights.",
			...data,
		});
		return;
	}

	renderBookingResult({
		status: "Flight search complete",
		message:
			"Your Crown Travel experience begins now. This fictional itinerary is ready to inspire your next adventure.",
		...data,
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
			alert("Não existe um usuário com este email");
			return;
		}

		if (user.password !== password) {
			alert("Senha incorreta");
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
			alert("Já existe um usuário com este email registrado.");
			return;
		}

		const addReq = objectStore.add({
			email: email,
			password: password,
			name: username,
			picture: "img/default.png",
		});
		addReq.onerror = (ev) => {
			alert("Ocorreu um erro ao criar o usuário, tente novamente.");
		};

		addReq.onsuccess = (ev) => {
			alert("Usuário criado com sucesso!");
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
				alert("A senha repetida deve ser igual à senha original.");
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
	startBannerRotation();
});
