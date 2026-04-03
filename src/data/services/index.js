import scrapCollection from "./scrapCollection";
import demolition from "./demolition";
import dismantling from "./dismantling";
import paperShredding from "./paperShredding";
import societyTieUp from "./societyTieUp";
import junkRemoval from "./junkRemoval";
import vehicleScrapping from "./vehicleScrapping";

// keyed by URL slug
const servicesData = {
  "scrap-collection": scrapCollection,
  "demolition-service": demolition,
  "demolition": demolition,           // alias
  "dismantling": dismantling,
  "paper-shredding": paperShredding,
  "society-tie-up": societyTieUp,
  "junk-removal-service": junkRemoval,
  "junk-removal": junkRemoval,        // alias
  "vehicle-scrapping": vehicleScrapping,
};

export default servicesData;
