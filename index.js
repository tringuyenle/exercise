const prompt = require('prompt-sync')();
const fs = require('fs');
const Merchants = {
    Restaurant: 1, 
    Retail: 2,
    Hotel: 3,
    Activity: 4
}

function checkValidOffersByRules({validDateExpect, currentOffer}) {
    // check category 
    if (currentOffer.category == Merchants.Hotel) return false;   

    // check valid date
    let validDate = new Date(currentOffer.valid_to).getTime();
    if (validDateExpect > validDate) return false;

    return true;
}

function filterOffersByRules({filteredOffers, currentOffer}) {
    // filter to choose closest merchant for currentOffer if currentOffer is available in multiple merchants
    if (currentOffer.merchants.length > 1) {
        currentOffer.merchants.sort(function compare(merchantA, merchantB) {return merchantA.distance - merchantB.distance});
        currentOffer.merchants = [currentOffer.merchants[0]];
    };

    // select the closest currentOffer to save into filteredOffers if currentOffer have the same category with exist offer in filterOffers
    const index = filteredOffers.findIndex(offerfiltered => (offerfiltered.category == currentOffer.category))
    if (index >= 0) {
        const distanceOfCurrentOffer = currentOffer.merchants[0].distance;
        const distanceOfExistOffer = filteredOffers[index].merchants[0].distance;
        if (distanceOfExistOffer > distanceOfCurrentOffer) filteredOffers[index] = currentOffer;
    } 
    else filteredOffers.push(currentOffer);
}

function handleOffersInExternalAPI() {
    const ADDITIONAL_VALID_DATES = 5;
    const readFile = require('./input.json');
    const offers = readFile.offers;
    const checkInDate = prompt("Enter check-in date (YYYY-MM-DD): ");

    let validDateExpect = new Date(checkInDate);
    validDateExpect.setDate(validDateExpect.getDate() + ADDITIONAL_VALID_DATES); 

    // handle Offers by rules
    let handledOffers = [];
    offers.forEach(offer => {
        // if offer is not valid => go to the next offer
        if (!checkValidOffersByRules({validDateExpect: validDateExpect, currentOffer: offer})) return;
        // filter this offer by rules and push into handledOffers 
        filterOffersByRules({filteredOffers: handledOffers, currentOffer: offer});
    })

    // sorting offers by distance
    handledOffers.sort(function compare(offerA, offerB) {return offerA.merchants[0].distance - offerB.merchants[0].distance});
    // return 2 offers even though there are several eligible offers
    handledOffers = (handledOffers.length > 1) ? handledOffers.slice(0,2):handledOffers;
    console.log("The result after handle: \n", {offers: handledOffers});

    // save the results to output.json
    fs.writeFile("output.json", JSON.stringify({offers: handledOffers}, null, "\t"), function(err) {
        if (err) {
            console.log(err);
        }
    });
}

// Run function
handleOffersInExternalAPI();
