import type { SupplierPriceInput } from "./supplier-prices";

export type SupplierPriceList = { supplier: string; label: string; items: SupplierPriceInput[] };

// Nexus company price list, supplied by the owner in September 2026.
// Nexus's own website (nexusappliances.com.ng) runs WooCommerce, but every
// solar item there is listed at a ₦0.01 placeholder, so it can't be synced
// automatically. Imported once from /admin/pricing, then edited there when
// Nexus sends a new list.
export const NEXUS_PRICE_LIST: SupplierPriceList = {
  label: "Nexus price list (Sept 2026)",
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

// LUXSUN price list, supplied by the owner in September 2026 with LUXSUN's
// "Product Availability Notice" flyer. The owner's list rounds sizes (4KVA,
// 5KWH); the flyer gives the exact models and voltages, so sizes here follow
// the flyer. Sizes the owner listed without a price (10kVA, 15kWh) are left
// out, and so are flyer models with no price yet (1.2kVA 12V, 20kVA
// three-phase, 2.56kWh, 7.68kWh, 8kWh). Add them in /admin/pricing once
// LUXSUN quotes them.
export const LUXSUN_PRICE_LIST: SupplierPriceList = {
  label: "LUXSUN price list (Sept 2026)",
  supplier: "LUXSUN",
  items: [
    { category: "inverter", name: "LUXSUN 4.2kVA 24V hybrid", size: 4.2, voltage: "24V", priceNgn: 280_000 },
    { category: "inverter", name: "LUXSUN 6.2kVA 48V hybrid", size: 6.2, voltage: "48V", priceNgn: 370_000 },
    { category: "inverter", name: "LUXSUN 8.2kVA 48V hybrid", size: 8.2, voltage: "48V", priceNgn: 560_000 },
    { category: "inverter", name: "LUXSUN 12kVA 48V hybrid", size: 12, voltage: "48V", priceNgn: 980_000 },
    {
      category: "battery",
      name: "LUXSUN lithium 5.12kWh",
      size: 5.12,
      chemistry: "lithium",
      priceNgn: 910_000,
      notes: "Flyer lists a 5.12kWh in both 24V and 48V. Confirm which one this price is for.",
    },
    { category: "battery", name: "LUXSUN lithium 10.24kWh 48V", size: 10.24, chemistry: "lithium", priceNgn: 1_470_000 },
    { category: "battery", name: "LUXSUN lithium 16kWh 48V", size: 16, chemistry: "lithium", priceNgn: 1_810_000 },
    { category: "battery", name: "LUXSUN lithium 17kWh 48V", size: 17, chemistry: "lithium", priceNgn: 2_020_000 },
  ],
};

export const SUPPLIER_PRICE_LISTS: SupplierPriceList[] = [NEXUS_PRICE_LIST, LUXSUN_PRICE_LIST];
