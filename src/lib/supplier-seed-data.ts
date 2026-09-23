import type { SupplierPriceInput } from "./supplier-prices";

// Nexus company price list, supplied by the owner in September 2026.
// Nexus's own website (nexusappliances.com.ng) runs WooCommerce, but every
// solar item there is listed at a ₦0.01 placeholder, so it can't be synced
// automatically the way Itel Solar is. Imported once from /admin/pricing,
// then edited there when Nexus sends a new list.
export const NEXUS_PRICE_LIST: { supplier: string; items: SupplierPriceInput[] } = {
  supplier: "Nexus",
  items: [
    { category: "inverter", name: "Nexus 2kVA 12V", size: 2, voltage: "12V", priceNgn: 185_000 },
    { category: "inverter", name: "Nexus 3kVA 24V", size: 3, voltage: "24V", priceNgn: 220_000 },
    { category: "inverter", name: "Nexus 4kVA 24V", size: 4, voltage: "24V", priceNgn: 280_000 },
    { category: "inverter", name: "Nexus 8.6kVA 48V", size: 8.6, voltage: "48V", priceNgn: 605_000 },
    { category: "inverter", name: "Nexus 11kVA 48V", size: 11, voltage: "48V", priceNgn: 630_000 },
    { category: "inverter", name: "Nexus 12.5kVA 48V", size: 12.5, voltage: "48V", priceNgn: 980_000 },
    {
      category: "battery",
      name: "Nexus lithium-ion 15.5kWh",
      size: 15.5,
      chemistry: "lithium",
      priceNgn: 1_850_000,
      notes: "Price sheet also said \"Not available\" above the lithium list. Confirm stock before quoting.",
    },
    {
      category: "battery",
      name: "Nexus lithium-ion 17.5kWh",
      size: 17.5,
      chemistry: "lithium",
      priceNgn: 2_300_000,
      notes: "Price sheet also said \"Not available\" above the lithium list. Confirm stock before quoting.",
    },
    { category: "panel", name: "Nexus 200W panel", size: 200, priceNgn: 42_000 },
    { category: "panel", name: "Nexus 300W panel", size: 300, priceNgn: 60_000 },
    { category: "panel", name: "Nexus 350W panel", size: 350, priceNgn: 65_000 },
    { category: "panel", name: "Nexus 380W panel", size: 380, priceNgn: 75_000 },
    { category: "panel", name: "Nexus 400W panel", size: 400, priceNgn: 88_000 },
    { category: "panel", name: "Nexus 450W panel", size: 450, priceNgn: 105_000 },
    { category: "panel", name: "Nexus 500W panel", size: 500, priceNgn: 115_000 },
    { category: "panel", name: "Nexus 550W panel", size: 550, priceNgn: 125_000 },
    {
      category: "panel",
      name: "Nexus 600W panel",
      size: 600,
      priceNgn: 130_000,
      notes: "Price sheet said ₦13,000, read as ₦130,000 (it sits between the 550W and 700W prices). Confirm with Nexus.",
    },
    { category: "panel", name: "Nexus 700W panel", size: 700, priceNgn: 145_000 },
  ],
};
