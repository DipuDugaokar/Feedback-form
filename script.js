const API_BASE_URL = 'https://sinister-spirit-4q645g7vrq5637776-3000.app.github.dev';
const cars = [
    {
        name: "Nissan Tekton",
        type: "SUV",
        image: "images/tekton.jpg"
    },
    {
        name: "Nissan Gravite",
        type: "Family MPV",
        image: "images/gravite.jpg"
    },
    {
        name: "Nissan Magnite",
        type: "Compact SUV",
        image: "images/magnite.jpg"
    },
    {
        name: "Nissan Kicks",
        type: "Crossover",
        image: "images/Coming-Soon-Banner_670X372pix.jpg"
    }
];

let selectedCar = 0;


// =====================================================
// 2. INITIALIZE THE PAGE
// =====================================================

$(document).ready(function () {

    // Check whether required libraries are available.

    if (typeof $.fn.owlCarousel !== "function") {
        console.error(
            "Owl Carousel is not loaded. Check your CDN links."
        );
        return;
    }

    initializeCarousel();
    initializeForm();
    initializeDate();
    initializeLocation();

});


// =====================================================
// 3. INITIALIZE OWL CAROUSEL
// =====================================================

function initializeCarousel() {

    const $carousel = $("#carTrack");

    if (!$carousel.length) {
        console.error(
            'Carousel container "#carTrack" was not found.'
        );
        return;
    }

    // Prevent duplicate initialization.

    if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger("destroy.owl.carousel");
        $carousel.removeClass("owl-loaded");
    }

    $carousel.empty();

    // Create vehicle cards.

    cars.forEach(function (car, index) {

        const isSelected = index === selectedCar;

        const card = `
            <div class="car-slide">

                <button
                    type="button"
                    class="car-option ${isSelected ? "selected" : ""}"
                    data-index="${index}"
                    aria-pressed="${isSelected}"
                    aria-label="Select ${car.name}"
                >

                    <div class="car-visual">

                        <img
                            src="${car.image}"
                            alt="${car.name}"
                            class="car-image"
                            loading="lazy"
                        >

                    </div>

                    <div class="car-caption">

                        <div class="car-name">
                            ${car.name}
                        </div>

                        <div class="car-type">
                            ${car.type}
                        </div>

                    </div>

                </button>

            </div>
        `;

        $carousel.append(card);

    });


    // Initialize Owl Carousel only once.

    $carousel.owlCarousel({

        loop: false,
        rewind: false,
        margin: 10,

        nav: false,
        dots: false,

        autoplay: false,

        smartSpeed: 400,

        responsiveRefreshRate: 100,

        responsive: {

            0: {
                items: 1
            },

            481: {
                items: 2
            },

            769: {
                items: 3
            }

        }

    });


    // Select a vehicle when its card is clicked.

    $carousel.on(
        "click",
        ".car-option",
        function () {

            const index = Number(
                $(this).attr("data-index")
            );

            selectCar(index);

        }
    );


    // Previous vehicle button.

    $("#prevCar")
        .off("click.carCarousel")
        .on("click.carCarousel", function () {

            $carousel.trigger("prev.owl.carousel");

        });


    // Next vehicle button.

    $("#nextCar")
        .off("click.carCarousel")
        .on("click.carCarousel", function () {

            $carousel.trigger("next.owl.carousel");

        });


    // Create custom pagination dots.

    renderDots();


    // Keep the selected vehicle visible when possible.

    $carousel.trigger(
        "to.owl.carousel",
        [selectedCar, 0, true]
    );

}


// =====================================================
// 4. SELECT VEHICLE
// =====================================================

function selectCar(index) {

    if (index < 0 || index >= cars.length) {
        return;
    }

    selectedCar = index;

    // Update hidden vehicle field.

    const vehicleInput = document.getElementById("vehicle");

    if (vehicleInput) {
        vehicleInput.value = cars[selectedCar].name;
    }

    // Update selected card styling.

    $(".car-option").each(function () {

        const cardIndex = Number(
            $(this).attr("data-index")
        );

        const isSelected = cardIndex === selectedCar;

        $(this)
            .toggleClass("selected", isSelected)
            .attr("aria-pressed", isSelected);

    });

    // Update pagination dots.

    updateDots();

}


// =====================================================
// 5. CREATE CUSTOM PAGINATION DOTS
// =====================================================

function renderDots() {

    const $dots = $("#carDots");

    if (!$dots.length) {
        return;
    }

    $dots.empty();

    cars.forEach(function (car, index) {

        const $dot = $("<button>", {

            type: "button",

            class:
                "dot" +
                (index === selectedCar ? " active" : ""),

            "aria-label": "Select " + car.name,

            "aria-pressed": index === selectedCar

        });


        $dot.on("click", function () {

            selectCar(index);

            // Move the carousel to the selected vehicle.

            $("#carTrack").trigger(
                "to.owl.carousel",
                [index, 400, true]
            );

        });


        $dots.append($dot);

    });

}


// =====================================================
// 6. UPDATE PAGINATION DOTS
// =====================================================

function updateDots() {

    $("#carDots .dot").each(function (index) {

        const isActive = index === selectedCar;

        $(this)
            .toggleClass("active", isActive)
            .attr("aria-pressed", isActive);

    });

}


// =====================================================
// 7. SET MINIMUM DATE
// =====================================================

function getToday() {

    const today = new Date();

    const localDate = new Date(
        today.getTime() -
        today.getTimezoneOffset() * 60000
    );

    return localDate.toISOString().split("T")[0];

}


function initializeDate() {

    const dateInput = document.getElementById("date");

    if (!dateInput) {
        return;
    }

    dateInput.min = getToday();

}


// =====================================================
// 8. FORM FIELD VALIDATION
// =====================================================

const requiredFields = [
    "firstName",
    "lastName",
    "mobile",
    "email",
    "date",
    "time",
    "dealer",
    "address"
];


function setError(id, message) {

    const input = document.getElementById(id);

    const error = document.getElementById(id + "Error");

    if (input) {

        input.classList.toggle(
            "invalid",
            Boolean(message)
        );

        input.setAttribute(
            "aria-invalid",
            message ? "true" : "false"
        );

    }

    if (error) {
        error.textContent = message || "";
    }

}


// =====================================================
// 9. VALIDATE ALL FORM FIELDS
// =====================================================

function validateForm() {

    let valid = true;

    // Clear previous errors.

    requiredFields.forEach(function (id) {

        setError(id, "");

    });


    // First name.

    const firstName =
        document.getElementById("firstName");

    if (firstName) {

        const value = firstName.value.trim();

        if (!value) {

            setError(
                "firstName",
                "Please enter your first name."
            );

            valid = false;

        } else if (value.length < 2) {

            setError(
                "firstName",
                "Enter at least 2 characters."
            );

            valid = false;

        }

    } else {
        valid = false;
    }


    // Last name.

    const lastName =
        document.getElementById("lastName");

    if (lastName && !lastName.value.trim()) {

        setError(
            "lastName",
            "Please enter your last name."
        );

        valid = false;

    }


    // Mobile number.

    const mobile =
        document.getElementById("mobile");

    if (mobile) {

        const digits = mobile.value.replace(/\D/g, "");

        if (!mobile.value.trim()) {

            setError(
                "mobile",
                "Please enter your mobile number."
            );

            valid = false;

        } else if (
            digits.length < 10 ||
            digits.length > 13
        ) {

            setError(
                "mobile",
                "Enter a valid mobile number."
            );

            valid = false;

        }

    }


    // Email.

    const email =
        document.getElementById("email");

    if (email) {

        const value = email.value.trim();

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!value) {

            setError(
                "email",
                "Please enter your email address."
            );

            valid = false;

        } else if (!emailPattern.test(value)) {

            setError(
                "email",
                "Please enter a valid email address."
            );

            valid = false;

        }

    }


    // Preferred date.

    const dateInput =
        document.getElementById("date");

    if (dateInput) {

        if (!dateInput.value) {

            setError(
                "date",
                "Please select a preferred date."
            );

            valid = false;

        } else if (dateInput.value < getToday()) {

            setError(
                "date",
                "The date cannot be in the past."
            );

            valid = false;

        }

    }


    // Preferred time.

    const timeInput =
        document.getElementById("time");

    if (timeInput && !timeInput.value) {

        setError(
            "time",
            "Please select a preferred time."
        );

        valid = false;

    }


    // Dealer.

    const dealer =
        document.getElementById("dealer");

    if (dealer && !dealer.value.trim()) {

        setError(
            "dealer",
            "Please select or enter a dealer."
        );

        valid = false;

    }


    // Address.

    const address =
        document.getElementById("address");

    const sameAddress =
        document.getElementById("sameAddress");

    const useSameAddress =
        sameAddress && sameAddress.checked;

    if (
        address &&
        !useSameAddress &&
        !address.value.trim()
    ) {

        setError(
            "address",
            "Please enter the test drive address."
        );

        valid = false;

    }


    return valid;

}


// =====================================================
// 10. LIVE VALIDATION
// =====================================================

function validateSingleField(id) {

    const input = document.getElementById(id);

    if (!input) {
        return;
    }

    const value = input.value.trim();

    let message = "";


    if (!value) {

        message = "This field is required.";

    }


    if (id === "firstName" && value.length === 1) {

        message = "Enter at least 2 characters.";

    }


    if (id === "email" && value) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!emailPattern.test(value)) {

            message = "Enter a valid email address.";

        }

    }


    if (id === "mobile" && value) {

        const digits = value.replace(/\D/g, "");

        if (
            digits.length < 10 ||
            digits.length > 13
        ) {

            message = "Enter a valid mobile number.";

        }

    }


    if (
        id === "date" &&
        value &&
        value < getToday()
    ) {

        message = "The date cannot be in the past.";

    }


    setError(id, message);

}


function initializeForm() {

    const form =
        document.getElementById("testDriveForm");

    if (!form) {

        console.error(
            'Form "#testDriveForm" was not found.'
        );

        return;

    }


    // Validate fields as users type.

    requiredFields.forEach(function (id) {

        const input = document.getElementById(id);

        if (!input) {
            return;
        }

        input.addEventListener("input", function () {

            if (input.classList.contains("invalid")) {

                validateSingleField(id);

            }

        });

        input.addEventListener("change", function () {

            if (input.classList.contains("invalid")) {

                validateSingleField(id);

            }

        });

    });


    // Form submission.

    form.addEventListener('submit', async function (event) {
  event.preventDefault();
  if (!validateForm()) {
    const firstInvalid = form.querySelector('.invalid');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const button = form.getElementsByClassName('submit-btn')[0];
  button.disabled = true;
  try {
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.sameAddress = document.getElementById('sameAddress').checked;
    const response = await fetch(`${API_BASE_URL}/api/test-drive-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Submission failed');
    showSummary();
  } catch (error) {
    console.error('Form submission failed:', error.message);
    alert('We could not save your request. Please try again.');
  } finally {
    button.disabled = false;
  }
});


    // Update address validation when the checkbox changes.

    const sameAddress =
        document.getElementById("sameAddress");

    if (sameAddress) {

        sameAddress.addEventListener("change", function () {

            if (sameAddress.checked) {

                setError("address", "");

            }

        });

    }


    // Popup close buttons.

    const closeButton =
        document.getElementById("closeModal");

    const editButton =
        document.getElementById("editDetails");

    const doneButton =
        document.getElementById("doneBtn");


    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }

    if (editButton) {
        editButton.addEventListener("click", closeModal);
    }

    if (doneButton) {
        doneButton.addEventListener("click", closeModal);
    }


    // Close popup by clicking the background.

    const modal =
        document.getElementById("confirmationModal");

    if (modal) {

        modal.addEventListener("click", function (event) {

            if (event.target === modal) {

                closeModal();

            }

        });

    }


    // Close popup with Escape key.

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            closeModal();

        }

    });

}


// =====================================================
// 11. FORMAT DATE
// =====================================================

function prettyDate(value) {

    if (!value) {
        return "—";
    }

    const date = new Date(value + "T12:00:00");

    return date.toLocaleDateString("en-IN", {

        day: "numeric",

        month: "long",

        year: "numeric"

    });

}


// =====================================================
// 12. SHOW CONFIRMATION POPUP
// =====================================================

function showSummary() {

    function getValue(id) {

        const element = document.getElementById(id);

        return element ? element.value.trim() : "";

    }


    const sameAddressCheckbox =
        document.getElementById("sameAddress");

    const sameAddress =
        sameAddressCheckbox &&
        sameAddressCheckbox.checked;


    const fullName = [

        getValue("title"),

        getValue("firstName"),

        getValue("middleName"),

        getValue("lastName")

    ].filter(Boolean).join(" ");


    const data = [

        ["Vehicle", cars[selectedCar].name],

        ["Name", fullName],

        ["Mobile number", getValue("mobile")],

        ["Email", getValue("email")],

        [
            "Preferred date",
            prettyDate(getValue("date"))
        ],

        ["Preferred time", getValue("time")],

        ["Dealer", getValue("dealer")],

        [
            "Test drive address",
            sameAddress
                ? "Same as current address"
                : getValue("address")
        ],

        [
            "Use same address",
            sameAddress ? "Yes" : "No"
        ]

    ];


    const summary =
        document.getElementById("summary");

    const modal =
        document.getElementById("confirmationModal");


    if (!summary || !modal) {

        console.error(
            "Confirmation popup elements were not found."
        );

        return;

    }


    // Clear existing values.

    summary.replaceChildren();


    // Add submitted values safely.

    data.forEach(function (item) {

        const row = document.createElement("div");

        row.className = "summary-item";


        const label = document.createElement("div");

        label.className = "summary-key";

        label.textContent = item[0];


        const value = document.createElement("div");

        value.className = "summary-value";

        value.textContent = item[1] || "—";


        row.appendChild(label);

        row.appendChild(value);

        summary.appendChild(row);

    });


    // Display the popup.

    modal.classList.add("open");


    const closeButton =
        document.getElementById("closeModal");

    if (closeButton) {
        closeButton.focus();
    }

}


// =====================================================
// 13. CLOSE CONFIRMATION POPUP
// =====================================================

function closeModal() {

    const modal =
        document.getElementById("confirmationModal");

    if (modal) {

        modal.classList.remove("open");

    }

}
