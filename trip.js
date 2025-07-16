$(document).ready(() => {
    // --- Star Animation Setup ---
    const starsContainer = $("#stars-container");
    const numberOfStars = 150;
    const travelDistance = 150;

    for (let i = 0; i < numberOfStars; i++) {
        const star = $("<div>").addClass("star");
        const size = Math.random() * 3 + 1;
        star.css({
            width: `${size}px`,
            height: `${size}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
        });

        const endX = (Math.random() - 0.5) * 2 * travelDistance;
        const endY = (Math.random() - 0.5) * 2 * travelDistance;
        star.css({
            '--end-x': `${endX}px`,
            '--end-y': `${endY}px`,
        });

        star.css({
            animationDuration: `${Math.random() * 10 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
        });

        starsContainer.append(star);
    }

    // --- Featured Destinations Logic ---
    const featuredDestinationsData = [
        { src: './beach.jpg', alt: 'A beautiful sunny beach with palm trees.', caption: 'Maldives' },
        { src: './city.jpg', alt: 'A bustling city skyline at night.', caption: 'Tokyo, Japan' },
        { src: './adventure.jpg', alt: 'A hiker looking over a mountain range.', caption: 'Andes Mountains' },
        { src: './relaxation.jpg', alt: 'A serene spa setting with candles and stones.', caption: 'Bali, Indonesia' }
    ];

    const toggleFeatured = $("#toggleFeatured");
    const featuredSection = $("#featuredDestinations");
    const featuredImage = $("#featuredImage");
    const featuredCaption = $("#featuredCaption");
    let currentFeaturedIndex = 0;

    function preloadImages() {
        featuredDestinationsData.forEach(dest => {
            const img = new Image();
            img.src = dest.src;
        });
    }

    function showDestination(index) {
        const destination = featuredDestinationsData[index];
        featuredImage.fadeOut(500, function() {
            $(this).attr({
                src: destination.src,
                alt: destination.alt
            }).fadeIn(500);
        });
        featuredCaption.fadeOut(500, function() {
            $(this).text(destination.caption).fadeIn(500);
        });
    }

    toggleFeatured.on("change", () => {
        featuredSection.toggleClass("hidden", !toggleFeatured.is(":checked"));
    });

    // --- Form Logic ---
    const tripForm = $("#tripForm");
    const destinationType = $("#destinationType");
    const specificDestinationField = $("#specificDestinationField");
    const specificDestination = $("#specificDestination");
    const tripDuration = $("#tripDuration");
    const totalTravelers = $("#totalTravelers");
    const budgetPerPerson = $("#budgetPerPerson");
    const planTripButton = $("#planTripButton");
    const resetButton = $("#resetButton");
    const tripSummaryOutput = $("#tripSummaryOutput");
    const summaryHeader = $("#summaryHeader");
    const summaryContent = $("#summaryContent");

    destinationType.on("change", () => {
        if (destinationType.val()) {
            specificDestinationField.slideDown();
        } else {
            specificDestinationField.slideUp();
        }
    });

    summaryHeader.on("click", () => {
        // Check if there's content to toggle
        if (summaryContent.html().trim() !== "") {
            summaryHeader.toggleClass("open");
            // Manually handle the accordion effect to work with CSS transitions
            if (summaryHeader.hasClass("open")) {
                summaryContent.css('max-height', summaryContent[0].scrollHeight + 'px');
            } else {
                summaryContent.css('max-height', '0');
            }
        }
    });

    resetButton.on("click", () => {
        tripForm[0].reset();
        $(".error-message").text("*");
        specificDestinationField.slideUp();
        tripSummaryOutput.slideUp();
        summaryHeader.removeClass("open");
        summaryContent.html("");
        // Explicitly collapse the summary content
        summaryContent.css('max-height', '0');
    });

    planTripButton.on("click", () => {
        let isValid = true;
        $(".error-message").text("*");

        // Validate Destination Type
        if (!destinationType.val()) {
            destinationType.next().text("Please select a destination type.");
            isValid = false;
        } else {
            // Validate Specific Destination
            if (!specificDestination.val().trim()) {
                specificDestination.next().text("Please enter a specific destination.");
                isValid = false;
            }
        }

        // Validate Trip Duration
        const days = parseInt(tripDuration.val(), 10);
        if (isNaN(days) || days <= 0) {
            tripDuration.next().text("Must be a number greater than 0.");
            isValid = false;
        }

        // Validate Number of Travelers
        const travelers = parseInt(totalTravelers.val(), 10);
        if (isNaN(travelers) || travelers <= 0) {
            totalTravelers.next().text("Must be a number greater than 0.");
            isValid = false;
        }

        // Validate Budget per Person
        const budget = parseFloat(budgetPerPerson.val());
        if (isNaN(budget) || budget <= 0) {
            budgetPerPerson.next().text("Must be a number greater than 0.");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Populate the summary content
        summaryContent.html(`
            <p><strong>Destination Type:</strong> ${destinationType.val()}</p>
            ${specificDestination.val() ? `<p><strong>Specific Destination:</strong> ${specificDestination.val()}</p>` : ""}
            <p><strong>Trip Duration:</strong> ${days} day(s)</p>
            <p><strong>Travelers:</strong> ${travelers}</p>
            <p><strong>Budget per Person:</strong> $${budget.toFixed(2)}</p>
            <hr>
            <p><strong>Total Estimated Cost:</strong> $${(days * travelers * budget).toFixed(2)}</p>
        `);

        // Show and expand the summary section
        tripSummaryOutput.slideDown();
        summaryHeader.addClass("open");
        summaryContent.css('max-height', summaryContent[0].scrollHeight + 'px');
    });

    // --- Initialize Featured Destinations ---
    preloadImages();
    showDestination(currentFeaturedIndex);
    setInterval(() => {
        currentFeaturedIndex = (currentFeaturedIndex + 1) % featuredDestinationsData.length;
        showDestination(currentFeaturedIndex);
    }, 5000);
});
