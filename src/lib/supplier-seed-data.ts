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

// SRNE dealer price list, supplied by the owner in September 2026. SRNE
// rates its inverters in kW; size here is that kW figure, used as kVA by the
// job calculator. HESP and ASP are separate SRNE series with different
// prices at the same size. Warranty (EOS05B/10B/15B 10 years, the rest 5)
// is kept in each battery's notes.
export const SRNE_PRICE_LIST: SupplierPriceList = {
  label: "SRNE dealer price list (Sept 2026)",
  supplier: "SRNE",
  items: [
    { category: "inverter", name: "SRNE 1.5kW 12V", size: 1.5, voltage: "12V", priceNgn: 282_000 },
    { category: "inverter", name: "SRNE 3kW 24V", size: 3, voltage: "24V", priceNgn: 301_000 },
    { category: "inverter", name: "SRNE 3.3kW 24V (500VDC PV)", size: 3.3, voltage: "24V", priceNgn: 390_000 },
    { category: "inverter", name: "SRNE AFP 5kW 48V (500VDC PV)", size: 5, voltage: "48V", priceNgn: 521_000 },
    { category: "inverter", name: "SRNE AEP 6kW 48V (500VDC PV)", size: 6, voltage: "48V", priceNgn: 727_000 },
    { category: "inverter", name: "SRNE ASP 10kW 48V", size: 10, voltage: "48V", priceNgn: 1_230_000 },
    { category: "inverter", name: "SRNE ASP 12kW 48V single phase", size: 12, voltage: "48V", priceNgn: 1_345_000 },
    { category: "inverter", name: "SRNE ASP 12kW 48V three phase", size: 12, voltage: "48V", priceNgn: 1_376_000, notes: "Three-phase." },
    { category: "inverter", name: "SRNE HESP 12kW 48V", size: 12, voltage: "48V", priceNgn: 2_344_000 },
    { category: "inverter", name: "SRNE HESP 12kW 48V three phase", size: 12, voltage: "48V", priceNgn: 2_450_000, notes: "Three-phase." },
    { category: "inverter", name: "SRNE ASP 16kW 48V single phase", size: 16, voltage: "48V", priceNgn: 2_415_000 },
    { category: "inverter", name: "SRNE ASP 20kW 48V three phase", size: 20, voltage: "48V", priceNgn: 2_945_000, notes: "Three-phase." },
    { category: "inverter", name: "SRNE HESP 20kW 48V three phase", size: 20, voltage: "48V", priceNgn: 3_980_000, notes: "Three-phase." },
    { category: "battery", name: "SRNE EOS05B 5kWh 48V", size: 5, voltage: "48V", chemistry: "lithium", priceNgn: 1_265_000, notes: "10-year warranty." },
    { category: "battery", name: "SRNE EOS10B 10kWh 48V", size: 10, voltage: "48V", chemistry: "lithium", priceNgn: 2_700_000, notes: "10-year warranty." },
    { category: "battery", name: "SRNE EOS15B 16.07kWh 48V", size: 16.07, voltage: "48V", chemistry: "lithium", priceNgn: 3_252_000, notes: "10-year warranty." },
    { category: "battery", name: "SRNE EOS02B-12 2.56kWh 12V 200Ah", size: 2.56, voltage: "12V", chemistry: "lithium", priceNgn: 553_000, notes: "5-year warranty." },
    { category: "battery", name: "SRNE EOS02B-24 2.56kWh 24V 100Ah", size: 2.56, voltage: "24V", chemistry: "lithium", priceNgn: 700_000, notes: "5-year warranty." },
    { category: "battery", name: "SRNE EOS08B-24 7.16kWh 24V 218Ah", size: 7.16, voltage: "24V", chemistry: "lithium", priceNgn: 1_430_000, notes: "5-year warranty." },
    { category: "battery", name: "SRNE SE05B 5kWh 48V", size: 5, voltage: "48V", chemistry: "lithium", priceNgn: 1_030_000, notes: "5-year warranty." },
    { category: "battery", name: "SRNE SE10B 10.49kWh 48V", size: 10.49, voltage: "48V", chemistry: "lithium", priceNgn: 2_000_000, notes: "5-year warranty." },
    { category: "battery", name: "SRNE SE15B 14.33kWh 48V", size: 14.33, voltage: "48V", chemistry: "lithium", priceNgn: 2_409_000, notes: "5-year warranty." },
    { category: "battery", name: "SRNE SE15B Pro 16.07kWh 48V", size: 16.07, voltage: "48V", chemistry: "lithium", priceNgn: 2_675_000, notes: "5-year warranty." },
  ],
};

export const SUPPLIER_PRICE_LISTS: SupplierPriceList[] = [NEXUS_PRICE_LIST, LUXSUN_PRICE_LIST, SRNE_PRICE_LIST];
